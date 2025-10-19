export enum TodoUrgency {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}


export type Todo = {
    id: string;
    title: string;
    description?: string;
    urgency: TodoUrgency;
    createdAt: Date;
    updatedAt: Date | null
};