# Chromium browser QA

EnPhiSim uses Playwright with Chromium as a separate UI smoke-test layer. It does not change the existing React, Express, MongoDB, or ML inference runtime.

The checks cover initial React mounting, uncaught JavaScript exceptions, and horizontal overflow at mobile (390px), tablet (768px), and desktop (1365px) widths. They do not submit phishing messages, collect credentials, or interact with third-party websites.

## Local run

Start the existing frontend:

```bash
cd frontend
npm install
npm start
```

In another terminal from the repository root:

```bash
python -m pip install -r tests/browser/requirements.txt
python -m playwright install chromium
python -m pytest -q tests/browser
```

Override the target with `ENPHISIM_BASE_URL`. Use only a local or otherwise authorised EnPhiSim instance. These smoke tests are not a security assessment or full end-to-end test of the API and ML service.
