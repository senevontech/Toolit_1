const validations = [
  {
    key: "NEXT_PUBLIC_SITE_URL",
    required: process.env.CI === "true",
  },
  {
    key: "NEXT_PUBLIC_API_URL",
    required: process.env.CI === "true",
  },
];

for (const item of validations) {
  const value = process.env[item.key]?.trim();
  if (!value) {
    if (item.required) {
      throw new Error(`${item.key} is required in CI/production validation.`);
    }
    continue;
  }

  try {
    new URL(value);
  } catch {
    throw new Error(`${item.key} must be a valid absolute URL.`);
  }
}

console.log("Frontend env validation passed.");
