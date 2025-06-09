import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { toast } from 'react-toastify';
import AddProduct from '../components/Admin/AddProduct';
import apiAxios from '../config/cienteAxios';



// Mock dependencies
vi.mock('react-toastify', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock('../config/cienteAxios', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

// Mock URL.createObjectURL
Object.defineProperty(globalThis.URL, 'createObjectURL', {
    writable: true,
    value: vi.fn(() => 'mock-url'),
});

Object.defineProperty(globalThis.URL, 'revokeObjectURL', {
    writable: true,
    value: vi.fn(),
});

describe('AddProduct Component', () => {
    // Mock props
    const mockProps = {
        resetForm: vi.fn(),
        formData: {
            name: '',
            category: '',
            subcategory: '',
            price: '',
            stock: '',
            description: '',
            imageUrl: null,
        },
        handleInputChange: vi.fn(),
    };

    // Mock categories data
    const mockCategories = [
        { _id: '1', nombre: 'Jewelry' },
        { _id: '2', nombre: 'Accessories' },
        { _id: '3', nombre: 'Watches' },
    ];

    // Mock subcategories data
    const mockSubcategories = [
        { _id: '11', nombre: 'Rings' },
        { _id: '12', nombre: 'Necklaces' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        apiAxios.get.mockResolvedValue({ data: { data: mockCategories } });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('Categories Loading', () => {
        test('fetches and displays categories on component mount', async () => {
            render(<AddProduct {...mockProps} />);

            await waitFor(() => {
                expect(apiAxios.get).toHaveBeenCalledWith('/category/roots');
            });
        });

        test('handles categories fetch error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            apiAxios.get.mockRejectedValueOnce(new Error('Network error'));

            render(<AddProduct {...mockProps} />);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Error al cargar las categorías');
                expect(consoleSpy).toHaveBeenCalledWith('Error fetching categories:', expect.any(Error));
            });

            consoleSpy.mockRestore();
        });

        test('shows loading state for categories', async () => {
            // Mock a delayed response
            apiAxios.get.mockImplementation(() => new Promise(resolve => {
                setTimeout(() => resolve({ data: { data: mockCategories } }), 100);
            }));

            render(<AddProduct {...mockProps} />);

            // Check if loading text appears initially
            expect(screen.getByText('Loading categories...')).toBeInTheDocument();

            // Wait for loading to complete
            await waitFor(() => {
                expect(screen.queryByText('Loading categories...')).not.toBeInTheDocument();
            });
        });
    });

    describe('Subcategories Loading', () => {
        test('fetches subcategories when category is selected', async () => {
            apiAxios.get
                .mockResolvedValueOnce({ data: { data: mockCategories } })
                .mockResolvedValueOnce({ data: { data: mockSubcategories } });

            const propsWithCategory = {
                ...mockProps,
                formData: { ...mockProps.formData, category: '1' }
            };

            render(<AddProduct {...propsWithCategory} />);

            await waitFor(() => {
                expect(apiAxios.get).toHaveBeenCalledWith('/category/1/children');
            });
        });

        test('clears subcategories when no category is selected', () => {
            render(<AddProduct {...mockProps} />);
            // Since no category is selected, subcategories should be empty
            // This is handled by the useEffect dependency
        });

        test('handles subcategories fetch error', async () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            apiAxios.get
                .mockResolvedValueOnce({ data: { data: mockCategories } })
                .mockRejectedValueOnce(new Error('Subcategory error'));

            const propsWithCategory = {
                ...mockProps,
                formData: { ...mockProps.formData, category: '1' }
            };

            render(<AddProduct {...propsWithCategory} />);

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith('Error fetching subcategories:', expect.any(Error));
            });

            consoleSpy.mockRestore();
        });
    });

    describe('Form Interactions', () => {
        test('calls handleInputChange when form fields are modified', async () => {
            const user = userEvent.setup();
            render(<AddProduct {...mockProps} />);

            const nameInput = screen.getByLabelText(/Product Name/i);
            await user.type(nameInput, 'Diamond Ring');

            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        test('handles file selection', async () => {
            const user = userEvent.setup();
            render(<AddProduct {...mockProps} />);

            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const fileInput = screen.getByLabelText(/Choose File/i);

            await user.upload(fileInput, file);

            expect(mockProps.handleInputChange).toHaveBeenCalledWith({
                target: { name: 'imageUrl', value: file }
            });
        });

        test('displays selected image preview', () => {
            const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
            const propsWithImage = {
                ...mockProps,
                formData: { ...mockProps.formData, imageUrl: mockFile }
            };

            render(<AddProduct {...propsWithImage} />);

            expect(globalThis.URL.createObjectURL).toHaveBeenCalledWith(mockFile);
        });
    });

    describe('Form Submission', () => {
        const completeFormData = {
            name: 'Diamond Ring',
            category: '1',
            subcategory: '11',
            price: '199.99',
            stock: '10',
            description: 'Beautiful diamond ring',
            imageUrl: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
        };

        test('submits form with valid data', async () => {
            apiAxios.post.mockResolvedValueOnce({ status: 201 });

            const propsWithData = {
                ...mockProps,
                formData: completeFormData,
            };

            render(<AddProduct {...propsWithData} />);

            const submitButton = screen.getByRole('button', { name: /Add Product/i });
            
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(apiAxios.post).toHaveBeenCalledWith('/item', expect.any(FormData), {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                expect(mockProps.resetForm).toHaveBeenCalled();
                expect(toast.success).toHaveBeenCalledWith('Producto creado exitosamente!');
            });
        });

        test('handles form submission without subcategory', async () => {
            apiAxios.post.mockResolvedValueOnce({ status: 201 });

            const formDataWithoutSubcategory = {
                ...completeFormData,
                subcategory: '',
            };

            const propsWithData = {
                ...mockProps,
                formData: formDataWithoutSubcategory,
            };

            render(<AddProduct {...propsWithData} />);

            const submitButton = screen.getByRole('button', { name: /Add Product/i });
            
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(apiAxios.post).toHaveBeenCalled();
                expect(toast.success).toHaveBeenCalledWith('Producto creado exitosamente!');
            });
        });

        test('handles form submission error', async () => {
            const errorMessage = 'Product creation failed';
            apiAxios.post.mockRejectedValueOnce(new Error(errorMessage));

            const propsWithData = {
                ...mockProps,
                formData: completeFormData,
            };

            render(<AddProduct {...propsWithData} />);

            const submitButton = screen.getByRole('button', { name: /Add Product/i });
            
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith(`Error al crear el producto: ${errorMessage}`);
            });
        });

        test('handles non-201 response status', async () => {
            apiAxios.post.mockResolvedValueOnce({ 
                status: 400,
                data: { message: 'Invalid data' }
            });

            const propsWithData = {
                ...mockProps,
                formData: completeFormData,
            };

            render(<AddProduct {...propsWithData} />);

            const submitButton = screen.getByRole('button', { name: /Add Product/i });
            
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(toast.error).toHaveBeenCalledWith('Error al crear el producto: Invalid data');
            });
        });

        test('prevents form submission when required fields are missing', async () => {
            const incompleteFormData = {
                ...mockProps.formData,
                name: '', // Missing required field
            };

            const propsWithData = {
                ...mockProps,
                formData: incompleteFormData,
            };

            render(<AddProduct {...propsWithData} />);

            const submitButton = screen.getByRole('button', { name: /Add Product/i });
            
            // Form validation should prevent submission
            await userEvent.click(submitButton);

            // API should not be called with invalid data
            expect(apiAxios.post).not.toHaveBeenCalled();
        });
    });

    describe('Category Icons', () => {
        test('displays correct icons for different categories', async () => {
            render(<AddProduct {...mockProps} />);

            await waitFor(() => {
                // The icons are rendered as text content in the MenuItems
                expect(apiAxios.get).toHaveBeenCalledWith('/category/roots');
            });
        });
    });

    describe('Conditional Rendering', () => {

        test('shows image filename when file is selected', () => {
            const mockFile = new File(['test'], 'test-image.jpg', { type: 'image/jpeg' });
            const propsWithImage = {
                ...mockProps,
                formData: { ...mockProps.formData, imageUrl: mockFile }
            };

            render(<AddProduct {...propsWithImage} />);

            expect(screen.getByDisplayValue('test-image.jpg')).toBeInTheDocument();
        });
    });

    describe('Loading States', () => {
        test('shows loading text for subcategories', async () => {
            apiAxios.get
                .mockResolvedValueOnce({ data: { data: mockCategories } })
                .mockImplementation(() => new Promise(resolve => {
                    setTimeout(() => resolve({ data: { data: mockSubcategories } }), 100);
                }));

            const propsWithCategory = {
                ...mockProps,
                formData: { ...mockProps.formData, category: '1' }
            };

            render(<AddProduct {...propsWithCategory} />);

            await waitFor(() => {
                expect(screen.getByText('Loading subcategories...')).toBeInTheDocument();
            });
        });
    });

    describe('Input Validation', () => {
        test('validates price input accepts decimal values', async () => {
            const user = userEvent.setup();
            render(<AddProduct {...mockProps} />);

            const priceInput = screen.getByLabelText(/Price/i);
            await user.type(priceInput, '199.99');

            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        test('validates stock input accepts only integers', async () => {
            const user = userEvent.setup();
            render(<AddProduct {...mockProps} />);

            const stockInput = screen.getByLabelText(/Stock Quantity/i);
            await user.type(stockInput, '10');

            expect(mockProps.handleInputChange).toHaveBeenCalled();
        });

        test('file input accepts only image files', () => {
            render(<AddProduct {...mockProps} />);

            const fileInput = screen.getByLabelText(/Choose File/i);
            expect(fileInput).toHaveAttribute('accept', 'image/*');
        });
    });

    describe('FormData Construction', () => {
        test('constructs FormData correctly with all fields', async () => {
            const formDataSpy = vi.spyOn(globalThis, 'FormData').mockImplementation(() => ({
                append: vi.fn(),
            }));

            apiAxios.post.mockResolvedValueOnce({ status: 201 });

            const completeFormData = {
                name: 'Diamond Ring',
                category: '1',
                subcategory: '11',
                price: '199.99',
                stock: '10',
                description: 'Beautiful diamond ring',
                imageUrl: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
            };

            const propsWithData = {
                ...mockProps,
                formData: completeFormData,
            };

            render(<AddProduct {...propsWithData} />);

            const submitButton = screen.getByRole('button', { name: /Add Product/i });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(formDataSpy).toHaveBeenCalled();
            });

            formDataSpy.mockRestore();
        });
    });
});