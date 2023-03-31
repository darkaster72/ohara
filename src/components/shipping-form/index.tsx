import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "~/hooks/useCart";
import FormField from "../form-field";

export interface ShippingForm {
  fullName: string;
  city: string;
  state: string;
  address: string;
  country: string;
  phone: string;
  postalCode: string;
}

const FormDefaultValue: ShippingForm = {
  country: "India",
  address: "",
  city: "",
  fullName: "",
  phone: "",
  postalCode: "",
  state: "",
};
export default function ShippingAddress() {
  const { cart, updateAddress } = useCart();
  const { handleSubmit, control, reset } = useForm<ShippingForm>({
    defaultValues: FormDefaultValue,
  });
  const onSubmit = (value: ShippingForm) => {
    updateAddress(value);
  };
  useEffect(() => {
    cart?.address && reset(cart.address);
  }, [cart?.address, reset]);

  return (
    <div className="block">
      <h3 className="block__title">Shipping information</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__input-row">
          <FormField control={control} name="address" placeholder="Address" />
        </div>

        <div className="form__input-row form__input-row--two">
          <FormField
            control={control}
            name="fullName"
            placeholder="Full Name"
          />

          <FormField control={control} name="city" placeholder="City" />
        </div>

        <div className="form__input-row form__input-row--two">
          <FormField control={control} name="state" placeholder="State" />

          <FormField
            control={control}
            name="postalCode"
            placeholder="Postal Code"
          />
        </div>

        <div className="form__input-row form__input-row--two">
          <FormField control={control} name="phone" placeholder="Phone" />
        </div>
        <button type="submit" className="btn btn--rounded btn--yellow">
          Submit
        </button>
      </form>
    </div>
  );
}
