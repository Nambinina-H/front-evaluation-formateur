// apiService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000'; // Remplacez par l'URL de votre API

// Fonction pour obtenir des données
export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

// Fonction pour créer des données
export const createData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création des données:', error);
    throw error;
  }
};

// Fonction pour mettre à jour des données
export const updateData = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    throw error;
  }
};

// Fonction pour supprimer des données
export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(`${API_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    throw error;
  }
};