"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MemberWithProfile } from "@/lib/data/members";
import type { EventParticipant, RsvpStatus } from "@/lib/types/domain";

const ROLE_LABEL: Record<string, string> = {
  organizer: "주최자",
  member: "참여자",
};

export function MembersView({
  initialMembers,
  initialParticipants,
}: {
  initialMembers: MemberWithProfile[];
  initialParticipants: EventParticipant[];
}) {
  const [members, setMembers] = useState(initialMembers);
  const [participants, setParticipants] = useState(initialParticipants);
  const [isOrganizerView, setIsOrganizerView] = useState(true);

  const handleRemove = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleRsvpChange = (userId: string, rsvpStatus: RsvpStatus) => {
    setParticipants((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, rsvpStatus } : p)),
    );
  };

  const handleAttendanceChange = (userId: string, attended: boolean) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.userId === userId
          ? { ...p, attendanceStatus: attended ? "attended" : "unconfirmed" }
          : p,
      ),
    );
  };

  const summary = {
    attending: participants.filter((p) => p.rsvpStatus === "attending").length,
    notAttending: participants.filter((p) => p.rsvpStatus === "not_attending")
      .length,
    pending: participants.filter((p) => p.rsvpStatus === "pending").length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsOrganizerView((prev) => !prev)}
        >
          {isOrganizerView ? "참여자로 보기" : "주최자로 보기"}
        </Button>
      </div>

      <Tabs defaultValue="roster">
        <TabsList>
          <TabsTrigger value="roster">멤버 로스터</TabsTrigger>
          <TabsTrigger value="attendance">회차별 참석</TabsTrigger>
        </TabsList>

        <TabsContent value="roster" className="flex flex-col gap-4 pt-4">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>역할</TableHead>
                  {isOrganizerView && (
                    <TableHead className="text-right">관리</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.displayName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.role === "organizer" ? "default" : "secondary"
                        }
                      >
                        {ROLE_LABEL[member.role]}
                      </Badge>
                    </TableCell>
                    {isOrganizerView && (
                      <TableCell className="text-right">
                        {member.role !== "organizer" && (
                          <RemoveMemberDialog
                            memberName={member.displayName}
                            onConfirm={() => handleRemove(member.id)}
                          />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="flex items-center justify-between gap-3 pt-6">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{member.displayName}</p>
                    <Badge
                      variant={
                        member.role === "organizer" ? "default" : "secondary"
                      }
                      className="w-fit"
                    >
                      {ROLE_LABEL[member.role]}
                    </Badge>
                  </div>
                  {isOrganizerView && member.role !== "organizer" && (
                    <RemoveMemberDialog
                      memberName={member.displayName}
                      onConfirm={() => handleRemove(member.id)}
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="flex flex-col gap-4 pt-4">
          <Card>
            <CardContent className="flex flex-wrap gap-4 pt-6 text-sm">
              <p>참석 {summary.attending}명</p>
              <p>불참 {summary.notAttending}명</p>
              <p>미응답 {summary.pending}명</p>
            </CardContent>
          </Card>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>RSVP</TableHead>
                  {isOrganizerView && <TableHead>출석</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => {
                  const participant = participants.find(
                    (p) => p.userId === member.userId,
                  );
                  const rsvpStatus = participant?.rsvpStatus ?? "pending";
                  const attended = participant?.attendanceStatus === "attended";

                  return (
                    <TableRow key={member.id}>
                      <TableCell>{member.displayName}</TableCell>
                      <TableCell>
                        <RsvpToggle
                          rsvpStatus={rsvpStatus}
                          onChange={(status) =>
                            handleRsvpChange(member.userId, status)
                          }
                        />
                      </TableCell>
                      {isOrganizerView && (
                        <TableCell>
                          <Checkbox
                            checked={attended}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(
                                member.userId,
                                checked === true,
                              )
                            }
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {members.map((member) => {
              const participant = participants.find(
                (p) => p.userId === member.userId,
              );
              const rsvpStatus = participant?.rsvpStatus ?? "pending";
              const attended = participant?.attendanceStatus === "attended";

              return (
                <Card key={member.id}>
                  <CardContent className="flex flex-col gap-3 pt-6">
                    <p className="font-medium">{member.displayName}</p>
                    <div className="flex items-center justify-between gap-2">
                      <RsvpToggle
                        rsvpStatus={rsvpStatus}
                        onChange={(status) =>
                          handleRsvpChange(member.userId, status)
                        }
                      />
                      {isOrganizerView && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            출석
                          </span>
                          <Checkbox
                            checked={attended}
                            onCheckedChange={(checked) =>
                              handleAttendanceChange(
                                member.userId,
                                checked === true,
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RsvpToggle({
  rsvpStatus,
  onChange,
}: {
  rsvpStatus: RsvpStatus;
  onChange: (status: RsvpStatus) => void;
}) {
  return (
    <div className="flex gap-1">
      <Button
        type="button"
        size="sm"
        variant={rsvpStatus === "attending" ? "default" : "outline"}
        onClick={() => onChange("attending")}
      >
        참석
      </Button>
      <Button
        type="button"
        size="sm"
        variant={rsvpStatus === "not_attending" ? "default" : "outline"}
        onClick={() => onChange("not_attending")}
      >
        불참
      </Button>
    </div>
  );
}

function RemoveMemberDialog({
  memberName,
  onConfirm,
}: {
  memberName: string;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          제거
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{memberName}님을 제거하시겠어요?</AlertDialogTitle>
          <AlertDialogDescription>
            제거된 멤버는 그룹에 다시 접근할 수 없습니다. 과거 기록은
            보존됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>제거</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
