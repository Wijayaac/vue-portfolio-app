import Airtable from "airtable";

const { AIRTABLE_API_KEY, AIRTABLE_BASE_KEY } = process.env;

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: AIRTABLE_API_KEY,
});

export const base = Airtable.base(AIRTABLE_BASE_KEY);
