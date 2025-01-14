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
});
