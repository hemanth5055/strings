import { formatDistanceToNowStrict } from "date-fns";

const getShortTimeAgo = (date: string | Date) => {
  const full = formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
    roundingMethod: "floor",
  });

  return full
    .replace("minutes", "mins")
    .replace("minute", "min")
    .replace("seconds", "secs")
    .replace("second", "sec");
};

const PostTime = ({ createdAt }: { createdAt: string }) => {
  return (
    <div className="text-sm text-gray-500 font-medium">
      {getShortTimeAgo(createdAt)}
    </div>
  );
};

export default PostTime;
