import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiAxios from '../../config/cienteAxios';
import AddIcon from '@mui/icons-material/Add';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Divider,
    Stack,
    TextField,
    Button,
    Autocomplete
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { refreshCategories } from '../../redux/slices/categorySlice'

function AddCategory() {
    const [categoryName, setCategoryName] = useState('');
    const [subCategoryName, setSubCategoryName] = useState('');
    const [parentCategories, setParentCategories] = useState([]);
    const [selectedParent, setSelectedParent] = useState(null);
    const [loadingParents, setLoadingParents] = useState(false);
    const [categoryAdded, setCategoryAdded] = useState(false);

    const dispatch = useDispatch();

    // Fetch parent categories for subcategory creation
    useEffect(() => {
        const fetchParents = async () => {
            setLoadingParents(true);
            try {
                const response = await apiAxios.get('/category/roots');
                const data = response.data.data || response.data;
                setParentCategories(data);
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                toast.error('Error al cargar las categorías principales');
                setParentCategories([]);
            } finally {
                setLoadingParents(false);
            }
        };
        fetchParents();
    }, [categoryAdded]);

    // Add Category
    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) {
            toast.error('El nombre de la categoría es obligatorio');
            return;
        }
        try {
            const response = await apiAxios.post('/category', { nombre: categoryName });
            if (response.status !== 201) throw new Error('Error al crear la categoría');
            setCategoryName('');
            dispatch(refreshCategories());
            toast.success('Categoría creada exitosamente!');
            setCategoryAdded(!categoryAdded);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error while creating category');
        }
    };

    const handleAddSubCategory = async (e) => {
        e.preventDefault();
        if (!subCategoryName.trim() || !selectedParent) {
            return;
        }
        try {
            const response = await apiAxios.post('/category', {
                nombre: subCategoryName,
                parentId: selectedParent._id
            });
            if (response.status !== 201) throw new Error('Error al crear la subcategoría');
            setSubCategoryName('');
            setSelectedParent(null);
            dispatch(refreshCategories());
            toast.success('Subcategoría creada exitosamente!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al crear la subcategoría');
        }
    };

    return (
        <Card
            elevation={0}
            sx={{
                mb: 4,
                borderRadius: 3,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(103, 52, 48, 0.2)',
                boxShadow: '0 8px 32px rgba(103, 52, 48, 0.15)'
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Box sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <AddIcon sx={{ color: 'white', fontSize: 28 }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#673430' }}>
                            Add Category / Subcategory
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Crea nuevas categorías o subcategorías para tus productos
                        </Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 4, background: 'linear-gradient(90deg, transparent, #673430, transparent)' }} />

                {/* Add Category */}
                <form onSubmit={handleAddCategory}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: '#673430', fontWeight: 600 }}>
                        New Category
                    </Typography>
                    <Box display="flex" gap={2} alignItems="center" mb={3}>
                        <TextField
                            label="Category Name"
                            value={categoryName}
                            onChange={e => setCategoryName(e.target.value)}
                            required
                            variant="outlined"
                            sx={{ flex: 1 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                                boxShadow: '0 4px 20px rgba(103, 52, 48, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a2b28 0%, #7a3e11 100%)'
                                }
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </form>

                {/* Add Subcategory */}
                <form onSubmit={handleAddSubCategory}>
                    <Typography variant="subtitle1" sx={{ mb: 1, color: '#673430', fontWeight: 600 }}>
                        New Subcategory
                    </Typography>
                    <Box display="flex" gap={2} alignItems="center">
                        <TextField
                            label="Subcategory name"
                            value={subCategoryName}
                            onChange={e => setSubCategoryName(e.target.value)}
                            required
                            variant="outlined"
                            sx={{ flex: 1 }}
                        />
                        <Autocomplete
                            options={parentCategories}
                            getOptionLabel={option => option.nombre}
                            value={selectedParent}
                            onChange={(_, value) => setSelectedParent(value)}
                            loading={loadingParents}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Parent category"
                                    required
                                    variant="outlined"
                                />
                            )}
                            sx={{ flex: 1, minWidth: 200 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<AddIcon />}
                            sx={{
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #673430 0%, #8B4513 100%)',
                                boxShadow: '0 4px 20px rgba(103, 52, 48, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a2b28 0%, #7a3e11 100%)'
                                }
                            }}
                        >
                            Add
                        </Button>
                    </Box>
                </form>
            </CardContent>
        </Card>
    );
}

export default AddCategory;