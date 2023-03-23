import { Router } from 'express';
import { Currency } from '../../DTO/Receipt/Currency';
import { CurrencyService } from '../../Services/Receipt/CurrencyService';
import { addCurrencies } from '../../Populator/Receipt/CurrencyPopulator';
import { getCurrentUserId } from '../../globals';

const currencyRoutes = Router();
const currencyService = new CurrencyService();

//CURRENCIES:

  currencyRoutes.get('/currencies/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId || getCurrentUserId();
      const currencies = await currencyService.getCurrenciesByUserId(userId);
      res.json(currencies);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Get a currency by id
  currencyRoutes.get('/currencies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const currency = await currencyService.getCurrencyById(id);
      res.json(currency);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Add a new currency
  currencyRoutes.post('/currencies', async (req, res) => {
    try {
      const { name, symbol } = req.body;
      const currency = new Currency(name, symbol);
      await currencyService.addCurrency(currency);
      res.json({ message: 'Currency added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Update a currency
  currencyRoutes.put('/currencies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, symbol } = req.body;
      const currency = new Currency(name, symbol);
      await currencyService.updateCurrency(id, currency);
      res.json({ message: 'Currency updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Delete a currency
  currencyRoutes.delete('/currencies/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await currencyService.deleteCurrency(id);
      res.json({ message: 'Currency deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Populate currencies
  currencyRoutes.post('/currencies/populate', async (req, res) => {
    try {
      await addCurrencies();
      res.json({ message: 'Currencies populated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default currencyRoutes;