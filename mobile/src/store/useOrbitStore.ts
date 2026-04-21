import { create } from "zustand";
import { OrbitTask, VibeTag } from "../types/task";

type OrbitState = {
  tasks: OrbitTask[];
  momentumScore: number;
  focusMode: boolean;
  addTask: (title: string, tags?: VibeTag[]) => void;
  addParsedTasks: (tasks: Array<{ title: string; vibeTags: VibeTag[]; uncertain?: boolean }>) => void;
  completeTask: (id: string) => void;
  snoozeTask: (id: string, minutes: number) => void;
  toggleFocusMode: () => void;
};

const seedTasks: OrbitTask[] = [
  {
    id: "t1",
    title: "Gym tomorrow at 7",
    dueAt: null,
    remindAt: null,
    vibeTags: ["grind"],
    status: "active",
    createdAt: new Date().toISOString(),
    completedAt: null,
  },
  {
    id: "t2",
    title: "Charge the car tonight",
    dueAt: null,
    remindAt: null,
    vibeTags: ["errand"],
    status: "active",
    createdAt: new Date().toISOString(),
    completedAt: null,
    uncertain: true,
  },
];

export const useOrbitStore = create<OrbitState>((set) => ({
  tasks: seedTasks,
  momentumScore: 12,
  focusMode: false,
  addTask: (title, tags = []) =>
    set((state) => ({
      tasks: [
        {
          id: `t_${Date.now()}`,
          title,
          dueAt: null,
          remindAt: null,
          vibeTags: tags,
          status: "active",
          createdAt: new Date().toISOString(),
          completedAt: null,
        },
        ...state.tasks,
      ],
    })),
  addParsedTasks: (newTasks) =>
    set((state) => ({
      tasks: [
        ...newTasks.map((task) => ({
          id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          title: task.title,
          dueAt: null,
          remindAt: null,
          vibeTags: task.vibeTags,
          status: "active" as const,
          createdAt: new Date().toISOString(),
          completedAt: null,
          uncertain: task.uncertain ?? false,
        })),
        ...state.tasks,
      ],
    })),
  completeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, status: "done", completedAt: new Date().toISOString() } : task
      ),
      momentumScore: state.momentumScore + 3,
    })),
  snoozeTask: (id, minutes) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "snoozed",
              remindAt: new Date(Date.now() + minutes * 60000).toISOString(),
            }
          : task
      ),
    })),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
}));
