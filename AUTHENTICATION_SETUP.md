# Authentication Setup Guide

## ⚠️ Important: First Time Setup Required

Before you can log in to the CRM Portal, you **must create user accounts first**. The authentication system is now working, but no users exist yet!

## Quick Start (3 Easy Steps)

### Step 1: Create Test Users
1. Look for the **prominent orange/amber alert box** at the top of the login page
2. Click the **"Click Here to Create Users Now"** button
3. A modal dialog will appear

### Step 2: Choose Your Option

**Option A: Create Default Test Users (Recommended)**
- Click **"Create Default Test Users"** button in the modal
- This creates 3 ready-to-use accounts:
  - `admin@ykkap.com` / `admin123` (Admin role)
  - `sales@ykkap.com` / `sales123` (Sales role)
  - `dealer@company.com` / `dealer123` (Dealer role)

**Option B: Create Custom User**
- Fill in the form fields:
  - Email address
  - Password
  - Full name (optional)
  - Role (Admin, Sales, Dealer, or Viewer)
- Click **"Create User"**

### Step 3: Log In
- Close the User Setup modal
- Enter the credentials of one of the users you just created
- Click **"Sign In"**

## Default Test Accounts

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@ykkap.com | admin123 | Admin | Full access to everything |
| sales@ykkap.com | sales123 | Sales | Orders, quotations, materials |
| dealer@company.com | dealer123 | Dealer | Limited to dealer functions |

## Troubleshooting

### "Invalid login credentials" Error

**This means you haven't created any users yet!**

✅ **Solution:**
1. Click the orange **"Click Here to Create Users Now"** button
2. Use the "Create Default Test Users" option
3. Wait for the success message
4. Then try logging in again

### User Creation Fails

If you get an error when creating users:

1. **Check Console Logs**: Open browser DevTools (F12) and look at the Console tab for detailed error messages
2. **Database Not Ready**: Make sure you've run all Supabase migrations (see `/SUPABASE_SETUP_GUIDE.md`)
3. **Environment Variables**: Verify that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly

### Already Created Users?

If you've already created the default test users, you'll see a message like:
- ✅ "All test users already exist or failed to create"

This is normal! Just proceed to log in with the existing credentials.

## Security Notes

- Passwords are hashed and securely stored by Supabase Auth
- Email confirmation is automatically set to `true` (bypassed for demo purposes)
- The `SUPABASE_SERVICE_ROLE_KEY` is only used on the backend server, never exposed to the frontend
- Test passwords (`admin123`, etc.) should be changed in production

## Next Steps After Login

Once logged in successfully:
1. ✅ You'll see the dashboard based on your role
2. ✅ Admins can access User Management and Admin Backend
3. ✅ Dealers have limited access (cannot see Admin sections)
4. ✅ All users can create quotations, manage orders, and view materials

## Need More Help?

- Check the browser console for detailed error messages
- Review `/SUPABASE_SETUP_GUIDE.md` for database setup
- Check `/supabase/README.md` for backend documentation
