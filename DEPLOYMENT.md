# Production Deployment Guide 🛠️

Follow this step-by-step guide to deploy **AI Video Content Studio** to production infrastructure.

---

## 1. Database & Authentication Deployment (Supabase)

1. Sign up at [Supabase](https://supabase.com) and create a new project.
2. Under **Project Settings -> API**, copy your `Project URL`, `anon public key`, and `service_role key`.
3. Open the **SQL Editor** tab in your Supabase project dashboard.
4. Copy and paste the entire script from `supabase/schema.sql` and click **Run**.
5. Enable Email Provider under **Authentication -> Providers**.

---

## 2. Backend API Deployment (Render / Railway / Render.com)

### Deploying to Render
1. Push your repository to GitHub / GitLab.
2. On Render.com, create a new **Web Service**.
3. Connect your repository and configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add the following **Environment Variables**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `ELEVENLABS_API_KEY`: `your_production_elevenlabs_key`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your_service_role_key`

---

## 3. Frontend Deployment (Vercel / Netlify)

### Deploying to Vercel
1. Log into [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your repository and set the **Root Directory** to `client`.
3. Vercel automatically detects Vite framework settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Configure **Environment Variables**:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your_anon_key`
   - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api`
5. Click **Deploy**.

---

## 4. Stripe Payment Webhook Integration (Optional)

To convert simulated upgrades into live payments:
1. In your Stripe Dashboard, navigate to **Developers -> Webhooks**.
2. Add an endpoint pointing to `https://your-render-backend-url.onrender.com/api/webhooks/stripe`.
3. Listen for events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Update the `public.subscriptions` table status when webhooks trigger.
