import type { Event } from "@/lib/types/domain";

const DUMMY_EVENTS: Event[] = [
  {
    id: "evt-1",
    groupId: "grp-1",
    title: "8월 첫째주 수영",
    eventAt: "2026-08-02T10:00:00.000Z",
    location: "올림픽수영장",
    createdAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "evt-2",
    groupId: "grp-2",
    title: "저녁 5km 러닝",
    eventAt: "2026-08-03T19:00:00.000Z",
    location: "한강공원",
    createdAt: "2026-07-10T00:00:00.000Z",
  },
];

export function getDummyEvents(): Event[] {
  return DUMMY_EVENTS;
}

export function getDummyEventsByGroupId(groupId: string): Event[] {
  return DUMMY_EVENTS.filter((event) => event.groupId === groupId);
}
