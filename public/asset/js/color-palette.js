/**
 * Adjusts the lightness of an OKLCH color value retrieved from a CSS custom property.
 * This function reads the current OKLCH value, modifies its lightness component
 * by a specified percentage, and returns the new OKLCH string.
 *
 * @param {string} cssVariableName - The name of the CSS custom property (e.g., '--primary-color').
 * @param {number} percentageModification - The percentage to modify the lightness.
 * Positive values make the color darker, negative values make it lighter.
 * @returns {string|null} The adjusted OKLCH color string, or `null` if the
 * CSS variable is invalid or not found.
 */
function adjustOklchLightness(cssVariableName, percentageModification) {
  // Retrieve the computed style of the document's root element.
  // This allows access to CSS custom properties defined globally.
  const computedStyle = getComputedStyle(document.documentElement);

  // Get the value of the specified CSS custom property and remove leading/trailing whitespace.
  const oklchValue = computedStyle.getPropertyValue(cssVariableName).trim();

  // Define a regular expression to parse the OKLCH color string.
  // It captures the lightness, chroma, and hue values.
  const oklchRegex = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/;
  // Attempt to match the OKLCH value against the defined regex.
  const match = oklchValue.match(oklchRegex);

  // Validate the parsing result. If no match is found, the CSS variable
  // is either not a valid OKLCH format or the variable does not exist.
  if (!match) {
    console.error(
      `Invalid OKLCH format or CSS variable "${cssVariableName}" not found.`,
    );
    return null;
  }

  // Extract and parse the lightness, chroma, and hue components from the regex match.
  // The match array typically holds the full match at index 0 and captured groups starting from index 1.
  let lightness = parseFloat(match[1]);
  const chroma = parseFloat(match[2]);
  const hue = parseFloat(match[3]);

  // Convert the percentage modification into a numeric factor.
  // For example, 10% becomes 0.10.
  let numericPercentage = parseFloat(percentageModification) / 100;

  // ---

  // Adjust the lightness based on the `percentageModification`.
  // If `numericPercentage` is positive (e.g., 0.10 for 10%), we want to make the color darker,
  // so we subtract from the lightness: `lightness - (lightness * 0.10)`.
  // If `numericPercentage` is negative (e.g., -0.10 for -10%), we want to make the color lighter,
  // so we add to the lightness: `lightness - (lightness * -0.10)` which becomes `lightness + (lightness * 0.10)`.
  lightness -= lightness * numericPercentage;

  // Clamp the lightness value to ensure it stays within the valid range of 0 to 1.
  // This prevents invalid OKLCH color values.
  lightness = Math.max(0, Math.min(1, lightness));

  // Construct and return the new OKLCH color string with the adjusted lightness.
  // Values are formatted to four decimal places for precision.
  return `oklch(${lightness.toFixed(4)} ${chroma.toFixed(4)} ${hue.toFixed(4)})`;
}
