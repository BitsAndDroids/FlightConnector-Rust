import InfoWindow from "@/components/InfoWindow";

const BundleInfo = () => {
  const infoMessage = `
A bundle is a group of outputs. 
For example, you can have a bundle for all outputs that are used for a specific controller. 
This makes it possible to send the correct data to the controller. 
You can also use these bundles to save multiple presets.`;
  return (
    <InfoWindow
      message={infoMessage}
      docs_url="https://bitsanddroids.github.io/FlightConnector-Rust/ch02-00-bundles.html"
    />
  );
};
export default BundleInfo;
