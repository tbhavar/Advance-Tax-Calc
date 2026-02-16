import { useState } from 'react';
import { Calculator, Linkedin, Mail, MessageCircle, FileText, IndianRupee, TrendingUp } from 'lucide-react';
import { calculateTax, IncomeInputs } from './utils/taxCalculator';

function App() {
  const [inputs, setInputs] = useState<IncomeInputs>({
    grossSalary: 0,
    businessIncome: 0,
    rentalIncome: 0,
    otherIncome: 0,
  });

  const taxData = calculateTax(inputs);

  const handleInputChange = (field: keyof IncomeInputs, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col">
      <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Advance Tax Calculator</h1>
              <p className="text-blue-200 text-sm">FY 2025-26 (AY 2026-27) | New Tax Regime u/s 115BAC</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <IndianRupee className="w-6 h-6 text-blue-900" />
                <h2 className="text-2xl font-bold text-blue-900">Income Details</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gross Salary Income
                  </label>
                  <input
                    type="number"
                    value={inputs.grossSalary || ''}
                    onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  />
                  <p className="text-xs text-gray-500 mt-1">Standard deduction of ₹75,000 will be applied</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Income from Business/Profession
                  </label>
                  <input
                    type="number"
                    value={inputs.businessIncome || ''}
                    onChange={(e) => handleInputChange('businessIncome', e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rental Income
                  </label>
                  <input
                    type="number"
                    value={inputs.rentalIncome || ''}
                    onChange={(e) => handleInputChange('rentalIncome', e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Other Income (Interest/Dividends)
                  </label>
                  <input
                    type="number"
                    value={inputs.otherIncome || ''}
                    onChange={(e) => handleInputChange('otherIncome', e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="w-6 h-6 text-blue-900" />
                <h2 className="text-2xl font-bold text-blue-900">Advance Tax Installments</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                      <th className="px-4 py-3 text-right font-semibold">%</th>
                      <th className="px-4 py-3 text-right font-semibold">Amount</th>
                      <th className="px-4 py-3 text-right font-semibold">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxData.advanceTaxInstallments.map((installment, index) => (
                      <tr
                        key={index}
                        className={`border-b ${
                          index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                        } hover:bg-blue-50 transition`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">{installment.date}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{installment.percentage}%</td>
                        <td className="px-4 py-3 text-right font-semibold text-blue-900">
                          {formatCurrency(installment.amount)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">
                          {formatCurrency(installment.cumulative)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {taxData.totalTax === 0 && (
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-800">
                  <p className="font-semibold">No advance tax liability</p>
                  <p className="text-sm">Enter your income details to calculate advance tax</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Tax Slab Rates (New Regime FY 2025-26)</h3>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span>Up to ₹4,00,000</span>
                  <span className="font-semibold">NIL</span>
                </div>
                <div className="flex justify-between">
                  <span>₹4,00,001 - ₹8,00,000</span>
                  <span className="font-semibold">5%</span>
                </div>
                <div className="flex justify-between">
                  <span>₹8,00,001 - ₹12,00,000</span>
                  <span className="font-semibold">10%</span>
                </div>
                <div className="flex justify-between">
                  <span>₹12,00,001 - ₹16,00,000</span>
                  <span className="font-semibold">15%</span>
                </div>
                <div className="flex justify-between">
                  <span>₹16,00,001 - ₹20,00,000</span>
                  <span className="font-semibold">20%</span>
                </div>
                <div className="flex justify-between">
                  <span>₹20,00,001 - ₹24,00,000</span>
                  <span className="font-semibold">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Above ₹24,00,000</span>
                  <span className="font-semibold">30%</span>
                </div>
              </div>
              <p className="text-xs mt-3 text-blue-200">
                * Rebate u/s 87A: If total income ≤ ₹12,00,000, tax is NIL (rebate up to ₹60,000)
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-900" />
                <h2 className="text-2xl font-bold text-blue-900">Tax Summary</h2>
              </div>

              <div className="space-y-4">
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Gross Total Income</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(taxData.grossTotalIncome)}</p>
                </div>

                {taxData.standardDeduction > 0 && (
                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-600">Less: Standard Deduction</p>
                    <p className="text-xl font-bold text-green-600">- {formatCurrency(taxData.standardDeduction)}</p>
                  </div>
                )}

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Total Taxable Income</p>
                  <p className="text-xl font-bold text-blue-900">{formatCurrency(taxData.totalIncome)}</p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Tax as per Slabs</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(taxData.taxBeforeRebate)}</p>
                </div>

                {taxData.rebateU87A > 0 && (
                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-600">Less: Rebate u/s 87A</p>
                    <p className="text-xl font-bold text-green-600">- {formatCurrency(taxData.rebateU87A)}</p>
                  </div>
                )}

                {taxData.surcharge > 0 && (
                  <div className="border-b pb-3">
                    <p className="text-sm text-gray-600">Add: Surcharge</p>
                    <p className="text-xl font-bold text-orange-600">+ {formatCurrency(taxData.surcharge)}</p>
                  </div>
                )}

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Add: Health & Education Cess (4%)</p>
                  <p className="text-xl font-bold text-orange-600">+ {formatCurrency(taxData.cess)}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-4 text-white">
                  <p className="text-sm opacity-90">Total Tax Payable</p>
                  <p className="text-3xl font-bold mt-1">{formatCurrency(taxData.totalTax)}</p>
                </div>

                {taxData.totalIncome <= 1200000 && taxData.totalTax === 0 && taxData.totalIncome > 0 && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 text-green-800">
                    <p className="font-semibold text-sm">Zero Tax Liability!</p>
                    <p className="text-xs mt-1">You are eligible for full rebate u/s 87A</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-blue-900 text-white py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-lg">
              Made with ❤️ by{' '}
              <a
                href="https://website-omega-steel.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:text-blue-300 transition underline"
              >
                CA Tanmay R Bhavar
              </a>
            </p>

            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition transform hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>

              <a
                href="https://wa.me/918329213804?text=Hi%20Tanmay,%20I%20am%20connecting%20with%20you%20after%20calculating%20tax%20from%20your%20Advance%20Tax%20Calculator."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-300 transition transform hover:scale-110"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-6 h-6" />
              </a>

              <a
                href="mailto:catanmaybhavar@gmail.com?subject=Getting%20in%20touch%20after%20using%20your%20Tax%20Calculator"
                className="hover:text-blue-300 transition transform hover:scale-110"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>

            <p className="text-xs text-blue-300 text-center">
              Disclaimer: This calculator is for informational purposes only. Please consult a qualified tax professional for accurate tax planning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
