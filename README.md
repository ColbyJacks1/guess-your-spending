# Guess Your Spending 💸

A fun, interactive web app that tests how well you know your spending habits! Upload your YNAB (You Need A Budget) export and play a guessing game to see if you can accurately predict your spending by retailer or category.

## Features

- 🎮 **Interactive Guessing Game** - Test your spending awareness category by category
- 🏪 **Two Game Modes** - Play by retailer (Amazon, Target, etc.) or by category (Groceries, Gas, etc.)
- 📅 **Flexible Date Ranges** - Choose from preset ranges (last month, 3/6/12 months, all time) or select custom year/month (defaults to last 12 months)
- 📊 **Detailed Results** - See your accuracy score, biggest surprises, and most accurate guesses
- 🔒 **Privacy First** - All data processing happens in your browser - nothing is uploaded to a server
- 🌓 **Dark Mode** - Automatic dark mode support
- 📱 **Mobile Friendly** - Fully responsive design

## How It Works

1. **Export your YNAB data** - Download your budget export from YNAB
2. **Upload the Register.csv file** - Drop it into the app
3. **Choose your game mode** - Retailer or Category
4. **Select your date range** - Defaults to last 12 months, or choose a custom period
5. **Make your guesses** - For each of your top spending categories
6. **See the results** - Find out how well you know your spending!

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **CSV Parsing**: Papa Parse
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/guess-your-spending.git

# Navigate to the project
cd guess-your-spending

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

This app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/guess-your-spending)

## How to Export from YNAB

1. Open YNAB and select your budget
2. Click on your budget name (top-left corner)
3. Select "Export Budget Data"
4. Download and extract the ZIP file
5. Upload the `Register.csv` file to the app

## Privacy & Security

- **No server uploads**: All CSV parsing and data processing happens entirely in your browser
- **No data storage**: Data is stored only in your browser's session storage during gameplay
- **No tracking**: No analytics or tracking scripts
- **Open source**: You can review the code to verify privacy claims

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

MIT License - feel free to use this project however you'd like!

## Acknowledgments

- Inspired by the "Guess Your Spend" feature in Monarch Money
- Built with the excellent shadcn/ui component library
- CSV parsing powered by Papa Parse

---

Made with ❤️ for YNAB users who want to test their spending awareness!
