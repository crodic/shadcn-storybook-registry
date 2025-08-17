import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

interface TimelineItemType {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface ITimeLine extends React.ComponentPropsWithoutRef<typeof Timeline> {
  items: TimelineItemType[];
}

const meta: Meta<ITimeLine> = {
  title: "ui/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  argTypes: {
    items: {
      control: "object",
    },
  },
  args: {
    defaultValue: 0,
    className: "w-96",
    items: [
      {
        id: 1,
        date: "2024-05-01",
        title: "Custom Event",
        description: "Some details...",
      },
      {
        id: 2,
        date: "2024-05-02",
        title: "Another Event",
        description: "More details...",
      },
    ] satisfies TimelineItemType[],
  },
  render: ({ items, ...args }) => (
    <Timeline {...args}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:sm:ms-32"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
              {item.date}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  ),
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<ITimeLine>;

export const Default: Story = {};
