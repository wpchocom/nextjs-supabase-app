"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CopyInviteLinkButton({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const absoluteUrl = new URL(inviteUrl, window.location.origin).toString();
    await navigator.clipboard.writeText(absoluteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" onClick={handleCopy}>
      {copied ? "복사됨" : "초대링크 복사"}
    </Button>
  );
}
