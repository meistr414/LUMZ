export const PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

export type Province = (typeof PROVINCES)[number];

export type DeliveryMethod = "standard" | "express" | "collect";

export type CheckoutDetails = {
  fullName: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    suburb: string;
    city: string;
    province: Province;
    postalCode: string;
  };
  deliveryMethod: DeliveryMethod;
  notes?: string;
  marketingOptIn: boolean;
  acceptedTerms: true;
};
