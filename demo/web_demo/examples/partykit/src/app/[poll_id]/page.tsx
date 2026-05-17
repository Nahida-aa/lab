import { notFound } from "next/navigation";
import type { Poll } from "@/app/types";
import Balloon from "@/components/Balloon";
import PollUI from "@/components/PollUI";
import { PARTYKIT_URL } from "@/env";

export default async function PollPage({
  params,
}: {
  params: Promise<{ poll_id: string }>;
}) {
  const pollId = (await params).poll_id;

  // 🎈 TODO: send a GET request to the PartyKit room
  const req = await fetch(`${PARTYKIT_URL}/party/${pollId}`, {
    method: "GET",
    next: {
      revalidate: 0, // revalidate: 0，Next.js 默认会缓存服务器获取的数据。由于投票数据应该始终保持最新，因此您可以禁用缓存
    },
  });

  if (!req.ok) {
    if (req.status === 404) {
      notFound();
    } else {
      throw new Error("Something went wrong.");
    }
  }
  // 🎈 TODO: replace the mock data
  const poll: Poll = (await req.json()) || {
    title: "Mock poll question?",
    options: ["Mock option A", "Mock option B"],
    votes: [0, 0],
  };

  return (
    <>
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">{poll.title}</h1>
        <PollUI id={pollId} options={poll.options} initialVotes={poll.votes} />
      </div>

      <Balloon float />
    </>
  );
}
