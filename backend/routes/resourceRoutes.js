import express from 'express';
import Resource from '../models/Resource.js';

const router = express.Router();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get resources by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const resources = await Resource.find({ category });
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get resources by type
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const resources = await Resource.find({ type });
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search resources
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const resources = await Resource.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error searching resources:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;