import { jest } from "@jest/globals";
import displayNotification from "../modules/notification";
import phoneFormatter from "../modules/phone-format";
import initButtonAnimation from "../modules/button-animation";

// Mock dependencies
jest.mock("../modules/notification");
jest.mock("../modules/phone-format");
jest.mock("../modules/button-animation");

describe("Form Submission Handler", () => {
  let mockForm;
  let mockSubmitButton;

  beforeEach(() => {
    // Setup DOM elements
    mockForm = document.createElement("form");
    mockForm.id = "my-form";

    mockSubmitButton = document.createElement("button");
    mockSubmitButton.type = "submit";
    mockForm.appendChild(mockSubmitButton);

    // Add form inputs
    const inputs = ["email", "phone", "name", "message", "csrf-token"];
    inputs.forEach((id) => {
      const input = document.createElement("input");
      input.id = id;
      input.value = `test-${id}`;
      mockForm.appendChild(input);
    });

    document.body.appendChild(mockForm);

    // Mock fetch
    global.fetch = jest.fn();
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  test("generateCsfrToken fetches and stores token correctly", async () => {
    const mockToken = "test-token";
    global.fetch.mockResolvedValueOnce({
      text: () => Promise.resolve(mockToken),
    });

    await generateCsfrToken();

    expect(global.fetch).toHaveBeenCalledWith("/php/generate-token.php");
    expect(localStorage.setItem).toHaveBeenCalledWith("csrf_token", mockToken);
    expect(document.getElementById("csrf-token").value).toBe(mockToken);
  });

  test("validateFormData handles validation success", async () => {
    const formData = {
      email: "test@example.com",
      phone: "123456789",
      name: "Test User",
      message: "Test message",
    };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    });

    const result = await validateFormData(mockSubmitButton, formData);
    expect(result).toBe(true);
  });

  test("validateFormData handles validation error", async () => {
    const formData = {
      email: "invalid-email",
      phone: "",
      name: "",
      message: "",
    };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ error: "Validation failed" }),
    });

    await expect(validateFormData(mockSubmitButton, formData)).rejects.toThrow(
      "Validation failed",
    );
    expect(displayNotification).toHaveBeenCalledWith(
      "Validation failed",
      "error",
    );
  });

  test("sendDataToServer handles successful submission", async () => {
    const mockData = new FormData();
    const mockFile = new File(["{}"], "test.txt");

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, message: "Success" }),
    });

    await sendDataToServer(mockSubmitButton, mockData, mockFile);

    expect(displayNotification).toHaveBeenCalledWith("Success", "success");
    expect(mockSubmitButton.disabled).toBe(false);
  });

  test("sendDataToServer handles submission error", async () => {
    const mockData = new FormData();
    const mockFile = new File(["{}"], "test.txt");

    global.fetch.mockRejectedValueOnce(new Error("Network error"));

    await sendDataToServer(mockSubmitButton, mockData, mockFile);

    expect(displayNotification).toHaveBeenCalledWith(
      "Wystąpił nieoczekiwany błąd. Proszę skontaktować się z administratorem.",
      "error",
    );
    expect(mockSubmitButton.disabled).toBe(false);
  });

  describe("getFormData", () => {
    test("returns correctly formatted form data", () => {
      const formData = getFormData();
      expect(formData).toEqual({
        email: "test-email",
        phone: "test-phone",
        name: "test-name",
        message: "test-message",
      });
    });

    test("strips non-digits from phone number", () => {
      document.getElementById("phone").value = "+1 (234) 567-8900";
      const formData = getFormData();
      expect(formData.phone).toBe("12345678900");
    });
  });

  describe("prepareData", () => {
    test("creates FormData with all required fields", () => {
      const formData = {
        email: "test@example.com",
        phone: "123456789",
        name: "Test User",
        message: "Test message",
      };
      const token = "test-token";

      const result = prepareData(formData, token);

      expect(result instanceof FormData).toBe(true);
      expect(result.get("email")).toBe(formData.email);
      expect(result.get("phone")).toBe(formData.phone);
      expect(result.get("name")).toBe(formData.name);
      expect(result.get("message")).toBe(formData.message);
      expect(result.get("g-recaptcha-response")).toBe(token);
      expect(result.get("csrf_token")).toBeDefined();
      expect(result.get("uniqueID")).toBeDefined();
    });
  });

  describe("handleError", () => {
    beforeEach(() => {
      global.Sentry = {
        captureException: jest.fn(),
      };
    });

    test("captures exception with correct data", () => {
      const mockFile = new File(["{}"], "test.txt");
      const mockError = new Error("Test error");

      handleError(mockFile, mockError);

      expect(Sentry.captureException).toHaveBeenCalledWith(
        mockError,
        expect.objectContaining({
          tags: { "form-name": "kontakt" },
          attachments: expect.arrayContaining([
            expect.objectContaining({
              filename: "form_data.txt",
              contentType: "text/plain",
            }),
          ]),
        }),
      );
    });

    test("displays correct error message for known errors", () => {
      const mockFile = new File(["{}"], "test.txt");
      const mockError = new Error("Błąd 404");

      handleError(mockFile, mockError);

      expect(displayNotification).toHaveBeenCalledWith(
        "Wystąpił błąd. Proszę spróbować ponownie.",
        "error",
      );
    });

    test("displays generic error message for unknown errors", () => {
      const mockFile = new File(["{}"], "test.txt");
      const mockError = new Error("Unknown error");

      handleError(mockFile, mockError);

      expect(displayNotification).toHaveBeenCalledWith(
        "Wystąpił nieoczekiwany błąd. Proszę skontaktować się z administratorem.",
        "error",
      );
    });
  });
});
