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
      
      // Robust string find-and-replace for the BACKUP_CONFIG_B64 variable
      const startMarker = 'const BACKUP_CONFIG_B64 = "';
      const startIndex = content.indexOf(startMarker);
      
      if (startIndex === -1) {
        // Try loose check for single quotes or spaces
        const looseStartMarker = "const BACKUP_CONFIG_B64 = '";
        const looseStartIndex = content.indexOf(looseStartMarker);
        if (looseStartIndex !== -1) {
          const endIndex = content.indexOf("'", looseStartIndex + looseStartMarker.length);
          if (endIndex !== -1) {
            content = content.substring(0, looseStartIndex + looseStartMarker.length) + b64Config + content.substring(endIndex);
          } else {
            return res.status(500).json({ success: false, error: "Could not find closing quote for BACKUP_CONFIG_B64 in App.tsx" });
          }
        } else {
          return res.status(500).json({ success: false, error: "Could not find BACKUP_CONFIG_B64 declaration in App.tsx" });
        }
      } else {
        const endIndex = content.indexOf('"', startIndex + startMarker.length);
        if (endIndex !== -1) {
          content = content.substring(0, startIndex + startMarker.length) + b64Config + content.substring(endIndex);
        } else {
          return res.status(500).json({ success: false, error: "Could not find closing double quote for BACKUP_CONFIG_B64 in App.tsx" });
        }
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
