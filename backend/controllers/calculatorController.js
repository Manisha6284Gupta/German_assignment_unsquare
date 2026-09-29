// @desc    Calculate broker commission & ROI metrics
// @route   POST /api/calculator/roi
// @access  Public
export const calculateRoi = async (req, res) => {
  try {
    const { loanAmount = 650000, dealsPerMonth = 6, commissionRate = 1.0 } = req.body;

    const monthlyVolume = Number(loanAmount) * Number(dealsPerMonth);
    const monthlyGrossCommission = monthlyVolume * (Number(commissionRate) / 100);
    const annualGrossCommission = monthlyGrossCommission * 12;

    const hoursSavedPerMonth = Number(dealsPerMonth) * 13;
    const hoursSavedPerYear = hoursSavedPerMonth * 12;

    const additionalDealsYear = Math.round(Number(dealsPerMonth) * 0.25 * 12);
    const additionalRevenueYear = additionalDealsYear * Number(loanAmount) * (Number(commissionRate) / 100);

    res.status(200).json({
      success: true,
      data: {
        monthlyVolume,
        monthlyGrossCommission,
        annualGrossCommission,
        hoursSavedPerYear,
        additionalDealsYear,
        additionalRevenueYear
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
