import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up high request size limit to support large image data URLs if saved
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // API to save configuration permanently to disk
  app.post("/api/save-config", (req, res) => {
    try {
      const { b64Config } = req.body;
      if (!b64Config || typeof b64Config !== "string") {
        return res.status(400).json({ success: false, error: "Base64 config is required" });
      }

      // Verify that it is valid JSON
      try {
        const decoded = Buffer.from(b64Config, 'base64').toString('utf-8');
        JSON.parse(decoded);
      } catch (e) {
        return res.status(400).json({ success: false, error: "Invalid base64 config format" });
      }

      const appPath = path.join(process.cwd(), "src", "App.tsx");
      if (!fs.existsSync(appPath)) {
        return res.status(404).json({ success: false, error: "App.tsx file not found" });
      }

      let content = fs.readFileSync(appPath, "utf8");
      
      // Regex to find and replace the BACKUP_CONFIG_B64 string
      const regex = /const BACKUP_CONFIG_B64\s*=\s*["`'][A-Za-z0-9+/=]+["`'];?/;
      if (!regex.test(content)) {
        const looseRegex = /const BACKUP_CONFIG_B64\s*=\s*["`'][^"`']*["`'];?/;
        if (looseRegex.test(content)) {
          content = content.replace(looseRegex, `const BACKUP_CONFIG_B64 = "${b64Config}";`);
        } else {
          return res.status(500).json({ success: false, error: "Could not locate BACKUP_CONFIG_B64 variable in App.tsx" });
        }
      } else {
        content = content.replace(regex, `const BACKUP_CONFIG_B64 = "${b64Config}";`);
      }

      fs.writeFileSync(appPath, content, "utf8");
      console.log("Successfully updated BACKUP_CONFIG_B64 in src/App.tsx!");

      return res.json({ success: true });
    } catch (err: any) {
      console.error("Error saving config:", err);
      return res.status(500).json({ success: false, error: err.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
