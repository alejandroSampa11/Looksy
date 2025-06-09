import { useState } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Chip, Typography, Collapse } from '@mui/material';

const NestedCategoryItem = ({ category, handleNavigation, level = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <ListItem
        button
        onClick={() => handleNavigation(`/category/${category._id}`)}
        sx={{
          pl: level * 3,
          borderRadius: 2,
          mb: 0.5,
          mx: 1,
          transition: 'all 0.2s ease-in-out',
          backgroundColor: isHovered ? 'rgba(103, 52, 48, 0.04)' : 'inherit',
          '&:hover': {
            backgroundColor: 'rgba(103, 52, 48, 0.08)',
            transform: 'translateX(8px)',
            boxShadow: '2px 2px 8px rgba(103, 52, 48, 0.1)'
          },
          '&:active': {
            transform: 'translateX(4px) scale(0.98)'
          }
        }}
      >
        <ListItemIcon
          sx={{
            color: '#673430',
            minWidth: 40,
            transition: 'color 0.2s ease-in-out'
          }}
        >
        </ListItemIcon>
        <ListItemText
          primary={category.nombre}
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: level === 0 ? 500 : 400,
              color: level === 0 ? '#333' : '#555',
              fontSize: level === 0 ? '1rem' : '0.9rem'
            }
          }}
        />
      </ListItem>

      {/* Subcategorías */}
      <Collapse
        in={isHovered && category.children && category.children.length > 0}
        timeout={200}
        unmountOnExit
        sx={{
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transformOrigin: 'top center'
        }}
      >
        <List sx={{ pl: level === 0 ? 2 : 0 }}>
          {category.children.map(child => (
            <NestedCategoryItem
              key={child._id}
              category={child}
              handleNavigation={handleNavigation}
              level={level + 1}
            />
          ))}
        </List>
      </Collapse>
    </div>
  );
};

const CategoryList = ({ categories, handleNavigation }) => {

  return (
    <List sx={{}}>

      <ListItem
        button
        onClick={() => handleNavigation('/')}
        sx={{
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(103, 52, 48, 0.08)',
            transform: 'translateX(8px)',
            boxShadow: '2px 2px 8px rgba(103, 52, 48, 0.1)'
          },
          '&:active': {
            transform: 'translateX(4px) scale(0.98)'
          }
        }}
      >
        <ListItemIcon
          sx={{
            color: '#673430',
            minWidth: 30,
            transition: 'color 0.2s ease-in-out'
          }}
        >
        </ListItemIcon>
        <ListItemText
          primary="Home"
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: 500,
              color: '#333',
              fontSize: '1rem'
            }
          }}
        />
      </ListItem>

      {categories.length > 0 ? (
        categories.map(cat => (
          <NestedCategoryItem
            key={cat._id}
            category={cat}
            handleNavigation={handleNavigation}
          />
        ))
      ) : (
        <Typography sx={{ px: 2, color: '#999' }}>
          Loading categories...
        </Typography>
      )}
    </List>
  );
};

export default CategoryList;