import ImageUpload from "@/components/features/image-uploads/image-upload";
import { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof ImageUpload> = {
  title: "Features/Image Upload",
  component: ImageUpload,
  tags: ["autodocs"],
  argTypes: {},
  args: {
    className: "w-full max-w-lg md:min-w-2xl",
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Default: Story = {};
