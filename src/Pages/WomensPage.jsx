import ProductListing from "./Productlisting";

export default function WomensPage() {
  return (
    <ProductListing
      gender="women"
      title="Women's Fashion"
      categories={["Dress", "Tops", "Jeans", "Skirt", "Jacket"]}
    />
  );
}
