# GitHub QR Generator

A beautiful, modern React application that generates QR codes for GitHub repositories with user avatars embedded in the center. Perfect for sharing repository links in a visually appealing way.

## ✨ Features

- **Real-time QR Generation**: Instantly generates QR codes when you select a repository
- **Avatar Integration**: Embeds your GitHub avatar in the center of each QR code  
- **Repository Browser**: Browse and select from all your GitHub repositories
- **Download Support**: Download QR codes as PNG images
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Beautiful UI**: Modern gradient design with glass-morphism effects
- **Fast & Lightweight**: Optimized build with minimal dependencies

## 🚀 Live Demo

Enter any GitHub username to explore their repositories and generate custom QR codes!

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **QRCode.js** - QR code generation library
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/github-qr-generator.git
   cd github-qr-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📖 Usage

1. **Enter GitHub Username**: Type any GitHub username in the search field
2. **Browse Repositories**: View user profile and repository information
3. **Select Repository**: Choose a repository from the dropdown menu
4. **Generate QR Code**: QR code appears instantly with the user's avatar in the center
5. **Download**: Click "Download QR" to save the QR code as a PNG image

## 🎨 Customization

### Modify Colors
Edit `client/global.css` to change the color scheme:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* Add your custom colors */
}
```

### Update Styling
Modify `tailwind.config.ts` to customize the design:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Your custom colors
      },
    },
  },
}
```

## 🌐 Deployment

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

### Vercel
1. Import your GitHub repository to Vercel
2. Framework preset: Vite
3. Deploy!

### Static Hosting
After running `npm run build`, upload the `dist` folder to any static hosting service.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- GitHub API for providing repository data
- QRCode.js library for QR code generation
- Radix UI for accessible components
- Tailwind CSS for styling utilities

## 📧 Contact

If you have any questions or suggestions, please feel free to reach out!

---

**Made with ❤️ for the GitHub community**
