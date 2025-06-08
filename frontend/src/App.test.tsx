// File: src/App.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock alert
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

// Mock API calls
jest.mock('./api', () => ({
  getTasks: jest.fn(() => Promise.resolve([])),
  addTask: jest.fn(() => Promise.resolve({ id: 1, title: 'Valid task', isDone: false })),
  deleteTask: jest.fn(() => Promise.resolve()),
  toggleTask: jest.fn(() => Promise.resolve()),
}));

describe('App Component Tests', () => {
  test('renders ToDo App heading', () => {
    render(<App />);
    expect(screen.getByText(/ToDo App/i)).toBeInTheDocument();
  });

  test('validates short task title', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByText(/add task/i));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Task must be longer than 10 characters.')
    );
  });

  test('adds a valid new task', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: 'This is a valid task title' },
    });
    fireEvent.click(screen.getByText(/add task/i));
    await waitFor(() => {
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
  });

  test('prevents adding duplicate task title', async () => {
    const { getTasks } = require('./api');
    getTasks.mockResolvedValue([
      { id: 1, title: 'Duplicate Task', isDone: false },
    ]);

    render(<App />);
    // wait until the mocked task appears
    await screen.findByText('Duplicate Task');

    fireEvent.change(screen.getByPlaceholderText(/task title/i), {
      target: { value: 'Duplicate Task' },
    });
    fireEvent.click(screen.getByText(/add task/i));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Task already exists.')
    );
  });
});