// File: src/components/TaskTable.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskTable from './TaskTable';
import { Task } from '../types/Task';

const mockTasks: Task[] = [
  { id: 1, title: 'Write tests', isDone: false, deadline: '2025-06-12' },
  { id: 2, title: 'Review code', isDone: true, deadline: '2025-06-10' },
];

describe('TaskTable Component Tests', () => {
  test('renders task table with tasks', () => {
    render(<TaskTable tasks={mockTasks} onDelete={() => {}} onToggle={() => {}} />);
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.getByText('Review code')).toBeInTheDocument();
  });

  test('filters pending tasks only', () => {
    render(<TaskTable tasks={mockTasks} onDelete={() => {}} onToggle={() => {}} />);
    fireEvent.change(screen.getByDisplayValue('All'), { target: { value: 'pending' } });
    expect(screen.getByText('Write tests')).toBeInTheDocument();
    expect(screen.queryByText('Review code')).not.toBeInTheDocument();
  });

  test('shows no result when search fails', () => {
    render(<TaskTable tasks={mockTasks} onDelete={() => {}} onToggle={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText('Search tasks...'), {
      target: { value: 'nonexistent' },
    });
    expect(screen.getByText('No tasks found.')).toBeInTheDocument();
  });

  test('marks overdue tasks in red', () => {
    const overdueTask: Task = {
        id: 3,
        title: 'Past deadline task',
        isDone: false,
        deadline: new Date(Date.now() - 86400000).toISOString(), // yesterday
    };

    render(<TaskTable tasks={[overdueTask]} onDelete={() => {}} onToggle={() => {}} />);

    // Find the row by looking for the parent of a checkbox with matching label
    const row = screen.getByRole('row', { name: /past deadline task/i });

    // Assert its style
    expect(row).toHaveStyle('color: red');
  });

  test('checkbox toggles when clicked', () => {
    const toggleMock = jest.fn();
    render(<TaskTable tasks={[mockTasks[0]]} onDelete={() => {}} onToggle={toggleMock} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(toggleMock).toHaveBeenCalledWith(1);
  });

  test('calls delete handler on button click', () => {
    const deleteMock = jest.fn();
    render(<TaskTable tasks={[mockTasks[0]]} onDelete={deleteMock} onToggle={() => {}} />);

    const deleteButton = screen.getByText('❌ Delete');
    fireEvent.click(deleteButton);
    expect(deleteMock).toHaveBeenCalledWith(1);
  });
});