import { Leaf, type LucideProps } from "lucide-react";

export const Icons = {
  logo: (props: LucideProps) => (
    <div className="bg-primary text-primary-foreground p-2 rounded-md">
      <Leaf {...props} />
    </div>
  ),
};
