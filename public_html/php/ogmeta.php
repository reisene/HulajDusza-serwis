<?php
/**
 * Generates Open Graph meta tags based on the metadata stored in metadata.json
 * @return string HTML code for Open Graph meta tags
 */
function generateOpenGraphMetaTags() {
  $metadata_file = 'metadata.json';
  $metadata = json_decode(file_get_contents($metadata_file), true);

  $og_title = $metadata['og_title'];
  $og_description = $metadata['og_description'];
  $og_image = $metadata['og_image'];
  $og_url = $metadata['og_url'];
  $og_type = $metadata['og_type'];

  $html_code = '';
  $html_code .= '<meta property="og:title" content="' . $og_title . '">';
  $html_code .= '<meta property="og:description" content="' . $og_description . '">';
  $html_code .= '<meta property="og:image" content="' . $og_image . '">';
  $html_code .= '<meta property="og:url" content="' . $og_url . '">';
  $html_code .= '<meta property="og:type" content="' . $og_type . '">';

  return $html_code;
}
?>
