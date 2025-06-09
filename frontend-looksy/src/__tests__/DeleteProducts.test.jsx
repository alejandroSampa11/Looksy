import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteProduct from '../components/Admin/DeleteProduct';
import apiAxios from '../config/cienteAxios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

// Mock dependencies
vi.mock('../config/cienteAxios');
vi.mock('sweetalert2');
vi.mock('react-toastify');

// Mock Material-UI components to avoid complex rendering issues in tests
vi.mock('@mui/material', async () => {
  const actual = await vi.importActual('@mui/material');
  return {
    ...actual,
    // Keep actual components but ensure they render properly in test environment
  };
});

describe('DeleteProduct Component', () => {
  const mockProps = {
    products: [
      {
        id: '1',
        name: 'Test Product 1',
        category: 'cat1',
        price: 29.99,
        stock: 15,
        imageUrl: '/test-image.jpg'
      },
      {
        id: '2',
        name: 'Test Product 2',
        category: 'cat2',
        price: 49.99,
        stock: 5,
        imageUrl: null
      }
    ],
    getStockColor: vi.fn((stock) => stock > 10 ? 'success' : 'warning'),
    fetchProducts: vi.fn()
  };

  const mockCategories = {
    data: {
      data: [
        { _id: 'cat1', nombre: 'Electronics' },
        { _id: 'cat2', nombre: 'Clothing' }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response for categories
    apiAxios.get.mockResolvedValue(mockCategories);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // Test 1: Component renders correctly with products and fetches categories
  it('should render component with products and fetch categories on mount', async () => {
    render(<DeleteProduct {...mockProps} />);

    // Check if main heading is rendered
    expect(screen.getByText('Manage Inventory')).toBeInTheDocument();
    expect(screen.getByText('Review and manage your product inventory. Delete products that are no longer available.')).toBeInTheDocument();

    // Check if table headers are rendered
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check if products are rendered
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();

    // Verify API call for categories was made
    await waitFor(() => {
      expect(apiAxios.get).toHaveBeenCalledWith('/category/roots');
    });

    // Wait for categories to load and check if they're displayed
    await waitFor(() => {
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('Clothing')).toBeInTheDocument();
    });

    // Verify getStockColor function is called for each product
    expect(mockProps.getStockColor).toHaveBeenCalledWith(15);
    expect(mockProps.getStockColor).toHaveBeenCalledWith(5);
  });

  // Test 2: Category fetching handles errors gracefully
  it('should handle category fetch errors and display default category names', async () => {
    // Mock API error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    apiAxios.get.mockRejectedValue(new Error('Network error'));

    render(<DeleteProduct {...mockProps} />);

    // Wait for the error to be handled
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching categories:', expect.any(Error));
    });

    // Check that unknown category is displayed when categories fail to load
    await waitFor(() => {
      expect(screen.getAllByText('Unknown Category')).toHaveLength(2);
    });

    consoleErrorSpy.mockRestore();
  });

  // Test 3: Delete product functionality with confirmation dialog
  it('should handle product deletion with confirmation dialog', async () => {
    // Mock Swal confirmation
    const mockSwalResult = { isConfirmed: true };
    Swal.fire.mockResolvedValue(mockSwalResult);
    
    // Mock successful delete API call
    apiAxios.delete.mockResolvedValue({});

    render(<DeleteProduct {...mockProps} />);

    // Wait for component to fully render
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Find and click the delete button for the first product
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('[data-testid*="DeleteIcon"], svg')
    );
    
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    // Verify Swal confirmation dialog is called
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });
    });

    // Wait for the delete API call
    await waitFor(() => {
      expect(apiAxios.delete).toHaveBeenCalledWith('/item', { 
        data: { id: mockProps.products[0].id } 
      });
    });

    // Verify success toast is shown
    expect(toast.success).toHaveBeenCalledWith('Producto eliminado exitosamente!');

    // Verify fetchProducts is called to refresh the list
    expect(mockProps.fetchProducts).toHaveBeenCalled();
  });

  // Bonus Test: Delete cancellation
  it('should not delete product when user cancels confirmation', async () => {
    // Mock Swal cancellation
    const mockSwalResult = { isConfirmed: false };
    Swal.fire.mockResolvedValue(mockSwalResult);

    render(<DeleteProduct {...mockProps} />);

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons.find(button => 
      button.querySelector('[data-testid*="DeleteIcon"], svg')
    );
    
    fireEvent.click(deleteButton);

    // Wait for Swal to be called
    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalled();
    });

    // Verify delete API is NOT called when cancelled
    expect(apiAxios.delete).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(mockProps.fetchProducts).not.toHaveBeenCalled();
  });
});