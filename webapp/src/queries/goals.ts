import { staleTimeDefault } from "./Client"
import {
    getArchivedGoals,
    getGoal,
    getGoals,
    getReachedGoals
} from "@api/goals"

export const reachedGoalsQuery = {
    queryKey: ['goals', 'reached'],
    queryFn: getReachedGoals,
    staleTime: staleTimeDefault
}

export const activeGoalsQuery = {
    queryKey: ['goals', 'active'],
    queryFn: getGoals,
    staleTime: staleTimeDefault
}

export const archivedGoalsQuery = {
    queryKey: ['goals', 'archived'],
    queryFn: getArchivedGoals,
    staleTime: staleTimeDefault
}

export function goalQuery(id: string) {
    return {
        queryKey: ['goals', 'details', id],
        queryFn: getGoal(id),
        staleTime: staleTimeDefault
    }
}