import ProductListing from "../Components/Productlisting";

export default function MensPage() {
  return (
    <ProductListing
      gender="men"
      title="Men's Fashion"
      categories={["Jacket", "Tshirt", "Shirt", "Trousers", "Jeans"]}
    />
  );
}
