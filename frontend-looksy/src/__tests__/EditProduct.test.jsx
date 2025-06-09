import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProduct from '../components/Admin/EditProduct';

// Mock dependencies
vi.mock('../config/cienteAxios', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Import mocked modules
import apiAxios from '../config/cienteAxios';

describe('EditProduct Component', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Product 1',
      category: 'cat1',
      price: 29.99,
      stock: 10,
      description: 'Description 1',
      imageUrl: 'image1.jpg'
    },
    {
      id: 2,
      name: 'Product 2',
      category: 'cat2',
      price: 49.99,
      stock: 5,
      description: 'Description 2',
      imageUrl: 'image2.jpg'
    }
  ];

  const mockCategories = [
    { _id: 'cat1', nombre: 'Electronics' },
    { _id: 'cat2', nombre: 'Clothing' }
  ];

  const mockFormData = {
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  };

  const mockProps = {
    selectedProduct: null,
    products: mockProducts,
    getStockColor: vi.fn(() => 'primary'),
    setSelectedProduct: vi.fn(),
    setFormData: vi.fn(),
    resetForm: vi.fn(),
    formData: mockFormData,
    fetchProducts: vi.fn(),
    handleInputChange: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful categories fetch
    apiAxios.get.mockResolvedValue({
      data: { data: mockCategories }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Component renders product selection table when no product is selected
  it('should render product selection table when no product is selected', async () => {
    render(<EditProduct {...mockProps} />);

    expect(screen.getByText('Select Product to Edit')).toBeInTheDocument();
    expect(screen.getByText('Choose a product from the list below to modify')).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check products are displayed
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  // Test 2: Component fetches categories on mount
  it('should fetch categories on component mount', async () => {
    render(<EditProduct {...mockProps} />);

    await waitFor(() => {
      expect(apiAxios.get).toHaveBeenCalledWith('/category/roots');
    });
  });

  // Test 3: Selecting a product for editing sets form data and shows edit form
  it('should select product for editing and show edit form', async () => {
    render(<EditProduct {...mockProps} />);

    // Click edit button for first product
    const editButtons = screen.getAllByRole('button');
    const editButton = editButtons.find(button => button.querySelector('[data-testid="EditIcon"]'));
    
    fireEvent.click(editButton);

    expect(mockProps.setSelectedProduct).toHaveBeenCalledWith(mockProducts[0]);
    expect(mockProps.setFormData).toHaveBeenCalledWith({
      name: 'Product 1',
      category: 'cat1',
      price: 29.99,
      stock: 10,
      description: 'Description 1',
      imageUrl: 'image1.jpg'
    });
  });

  // Test 4: Edit form renders correctly when product is selected
  it('should render edit form when product is selected', () => {
    const propsWithSelectedProduct = {
      ...mockProps,
      selectedProduct: mockProducts[0],
      formData: {
        name: 'Product 1',
        category: 'cat1',
        price: '29.99',
        stock: '10',
        description: 'Description 1',
        imageUrl: 'image1.jpg'
      }
    };

    render(<EditProduct {...propsWithSelectedProduct} />);

    expect(screen.getByText('Edit Product')).toBeInTheDocument();
    expect(screen.getByText('Update product information for Product 1')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByDisplayValue('Product 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('29.99')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Description 1')).toBeInTheDocument();
    
    // Check buttons
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('💾 Save Changes')).toBeInTheDocument();
  });



  // Test 7: Cancel button resets form and clears selected product
  it('should handle cancel button click', async () => {
    const user = userEvent.setup();
    
    const propsWithSelectedProduct = {
      ...mockProps,
      selectedProduct: mockProducts[0],
      formData: {
        name: 'Product 1',
        category: 'cat1',
        price: '29.99',
        stock: '10',
        description: 'Description 1',
        imageUrl: 'image1.jpg'
      }
    };

    render(<EditProduct {...propsWithSelectedProduct} />);

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockProps.setSelectedProduct).toHaveBeenCalledWith(null);
    expect(mockProps.resetForm).toHaveBeenCalled();
  });
});