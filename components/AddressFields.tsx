"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { PROVINCES } from "@/types/checkout";
import type { CheckoutFormInput } from "@/lib/schemas/checkout";

export function AddressFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormInput>();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="line1" className="text-sm font-medium">
          Street address
        </label>
        <Input
          id="line1"
          autoComplete="address-line1"
          maxLength={100}
          aria-invalid={!!errors.address?.line1}
          aria-describedby={errors.address?.line1 ? "line1-error" : undefined}
          {...register("address.line1")}
        />
        {errors.address?.line1 && (
          <p id="line1-error" className="text-sm text-destructive" role="alert">
            {errors.address.line1.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="line2" className="text-sm font-medium">
          Apartment, complex, unit{" "}
          <span className="font-normal text-foreground/50">(optional)</span>
        </label>
        <Input
          id="line2"
          autoComplete="address-line2"
          maxLength={100}
          {...register("address.line2")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="suburb" className="text-sm font-medium">
          Suburb
        </label>
        <Input
          id="suburb"
          autoComplete="address-level3"
          aria-invalid={!!errors.address?.suburb}
          aria-describedby={errors.address?.suburb ? "suburb-error" : undefined}
          {...register("address.suburb")}
        />
        {errors.address?.suburb && (
          <p
            id="suburb-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.address.suburb.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="text-sm font-medium">
            City / town
          </label>
          <Input
            id="city"
            autoComplete="address-level2"
            aria-invalid={!!errors.address?.city}
            aria-describedby={errors.address?.city ? "city-error" : undefined}
            {...register("address.city")}
          />
          {errors.address?.city && (
            <p
              id="city-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.address.city.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="province" className="text-sm font-medium">
            Province
          </label>
          <select
            id="province"
            autoComplete="address-level1"
            aria-invalid={!!errors.address?.province}
            aria-describedby={
              errors.address?.province ? "province-error" : undefined
            }
            className="h-11 rounded-lg border border-input bg-transparent px-3 text-base md:text-sm"
            defaultValue=""
            {...register("address.province")}
          >
            <option value="" disabled>
              Select a province
            </option>
            {PROVINCES.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          {errors.address?.province && (
            <p
              id="province-error"
              className="text-sm text-destructive"
              role="alert"
            >
              {errors.address.province.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 sm:w-48">
        <label htmlFor="postalCode" className="text-sm font-medium">
          Postal code
        </label>
        <Input
          id="postalCode"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={4}
          aria-invalid={!!errors.address?.postalCode}
          aria-describedby={
            errors.address?.postalCode ? "postalCode-error" : undefined
          }
          {...register("address.postalCode")}
        />
        {errors.address?.postalCode && (
          <p
            id="postalCode-error"
            className="text-sm text-destructive"
            role="alert"
          >
            {errors.address.postalCode.message}
          </p>
        )}
      </div>
    </div>
  );
}
