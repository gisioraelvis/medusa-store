import type { SettingConfig } from "@medusajs/admin";
import type { SettingProps } from "@medusajs/admin";

const CustomSettingPage = ({ notify }: SettingProps) => {
  const handleClick = () => {
    notify.success("Success", "You clicked the button");
  };

  return (
    <div>
      <h1>Custom Setting Page</h1>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
};

export const config: SettingConfig = {
  card: {
    label: "Custom",
    description: "Manage your custom settings",
  },
};

export default CustomSettingPage;
