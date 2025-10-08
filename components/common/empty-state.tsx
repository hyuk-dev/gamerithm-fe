import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface EmptyStateProps {
  type: "no-games" | "not-logged-in" | "error";
  onRetry?: () => void;
}

export function EmptyState({ type, onRetry }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case "not-logged-in":
        return {
          icon: (
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          ),
          title: "로그인이 필요합니다",
          description:
            "게임 라이브러리를 보려면 Steam 계정으로 로그인해주세요.",
          action: (
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-6 py-3">
                Steam으로 로그인
              </Button>
            </Link>
          ),
        };
      case "no-games":
        return {
          icon: (
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-7a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          title: "게임이 없습니다",
          description:
            "Steam 라이브러리에 게임이 없거나 데이터를 불러올 수 없습니다.",
          action: (
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={onRetry}
            >
              다시 시도
            </Button>
          ),
        };
      case "error":
        return {
          icon: (
            <svg
              className="w-16 h-16 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          ),
          title: "데이터를 불러올 수 없습니다",
          description:
            "네트워크 오류 또는 서버 문제로 게임 데이터를 불러올 수 없습니다.",
          action: (
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={onRetry}
            >
              다시 시도
            </Button>
          ),
        };
    }
  };

  const content = getContent();

  return (
    <Card className="bg-[#1a1a2e] border-gray-800 p-12 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="p-4 bg-gray-900 rounded-full">{content.icon}</div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">{content.title}</h3>
          <p className="text-gray-400 max-w-md">{content.description}</p>
        </div>
        {content.action}
      </div>
    </Card>
  );
}
