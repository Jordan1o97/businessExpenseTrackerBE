import { Currency } from "../../DTO/Receipt/Currency";
import { CurrencyService } from "../../Services/Receipt/CurrencyService";

export async function addCurrencies(): Promise<void> {
    const defaultCurrencies = [
        new Currency( "Afgan Afghani (1927-2002)", "AFA"),
        new Currency( "Afghan Afghani", "AFN"),
        new Currency( "Albanian Lek", "ALL"),
        new Currency( "Albanian Lek (1946-1965)", "ALK"),
        new Currency( "Algerian Dinar", "DZD"),
        new Currency( "Andorran Peseta", "ADP"),
        new Currency( "Bahamian Dollar", "BSD"),
        new Currency( "Bahraini Dinar", "BHD"),
        new Currency( "British Pound Sterling", "GBP"),
        new Currency( "CFA Franc BCEAO", "XOF"),
        new Currency( "CFA Franc BEAC", "XAF"),
        new Currency( "CFP Franc", "XPF"),
        new Currency( "Cambodian Riel", "KHR"),
        new Currency( "Canadian Dollar", "CAD"),
        new Currency( "Danish Krone", "DKK"),
        new Currency( "Diboutian Franc", "DJF"),
        new Currency( "Dominican Peso", "DOP"),
        new Currency( "Ecuadorian Sucre", "ECS"),
        new Currency( "Ecuadorian Unit of Constant Value", "ECV"),
        new Currency( "Euro", "EUR"),
        new Currency( "Falkland Islands Pound", "FKP"),
        new Currency( "Filian Dollar", "FJD"),
        new Currency( "Finnish Markka", "FIM"),
        new Currency( "Gambian Dalasi", "GMD"),
        new Currency( "Georgian Kupon Larit", "GEK"),
        new Currency( "Georgian Lari", "GEL"),
        new Currency( "Haitian Gourde", "HTG"),
        new Currency( "Honduran Lempira", "HNL"),
        new Currency( "Hong Kong Dollar", "HKD"),
        new Currency( "Hungarian Forint", "HUF"),
        new Currency( "Icelandic Krona", "ISK"),
        new Currency( "Icelandic Krona (1918-1981)", "ISJ"),
        new Currency( "Indian Rupee", "INR"),
        new Currency( "Jamaican Dollar", "JMD"),
        new Currency( "Japanese Yen", "JPY"),
        new Currency( "Jordanian Dinar", "JOD"),
        new Currency( "Kazakhstani Tenge", "KZT"),
        new Currency( "Kenyan Shilling", "KES"),
        new Currency( "Kuwaiti Dinar", "KWD"),
        new Currency( "Kyrgystani Som", "KGS"),
        new Currency( "Latvian Lats", "LVL"),
        new Currency( "Latvian Ruble", "LVR"),
        new Currency( "Macanese Pataca", "MOP"),
        new Currency( "Macedonian Denar", "MKD"),
        new Currency( "Macedonian Dear (1992-1993)", "MKN"),
        new Currency( "Namibian Dollar", "NAD"),
        new Currency( "Nepalese Rupee", "NPR"),
        new Currency( "Netherlands Antillean Guilder", "ANG"),
        new Currency( "Omani Rial", "OMR"),
        new Currency( "Pakistani Rupee", "PKR"),
        new Currency( "Panamanian Balboa", "PAB"),
        new Currency( "Qatari Rial", "QAR"),
        new Currency( "RINET Funds", "XRE"),
        new Currency( "Rhodesian Dollar", "RHD"),
        new Currency( "Romanian Leu", "RON"),
        new Currency( "Saint Helena Pound", "SHP"),
        new Currency( "Salvadoran Colon", "SVC"),
        new Currency( "Samoan Tala", "WST"),
        new Currency( "Tajikistani Ruble", "TJR"),
        new Currency( "Tajikistani Somoni", "TJS"),
        new Currency( "Tanzanian Shilling", "TZS"),
        new Currency( "US Dollar", "USD"),
        new Currency( "US Dollar (Next Day)", "USN"),
        new Currency( "US Dollar (Same Day)", "USS"),
        new Currency( "Vanuatu Vatu", "VUV"),
        new Currency( "Venezuelan Bolivar", "VEF"),
        new Currency( "Venezuelan Bolivar (1871-2008)", "VEB"),
        new Currency( "WIR Euro", "CHE"),
        new Currency( "WIR Franc", "CHW"),
        new Currency( "Yemeni Dinar", "YER"),
        new Currency( "Yemeni Rial", "YUD"),
        new Currency( "Yugoslavian Convertible Dinar (1990-1992) YUN T U", "YUN"),
        new Currency( "Zairean New Zaire (1993-1998)", "ZRN"),
        new Currency( "Zairean Zaire (1971-1993)", "ZRZ"),
        new Currency( "Zambian Kwacha", "ZMW"),
      ];

  const currencyService = new CurrencyService();

  for(var currency of defaultCurrencies){
    await currencyService.addCurrency(currency);
  }
}