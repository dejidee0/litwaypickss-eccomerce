import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase"; // ensure this exports your initialized Supabase client

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setUser({ ...session.user, ...profile });
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()
            .then(({ data }) => {
              setUser({ ...session.user, ...data });
            });
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Login failed");
      setLoading(false);
      return { success: false, error };
    }

    const {
      data: { user: supaUser },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", supaUser.id)
      .single();

    const fullUser = { ...supaUser, ...profile };
    setUser(fullUser);
    toast.success("Signed in successfully!");
    setLoading(false);
    return { success: true, user: fullUser };
  };

  const register = async (userData) => {
    setLoading(true);

    const { email, password, ...metadata } = userData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) {
      toast.error(error.message || "Registration failed");
      setLoading(false);
      return { success: false, error };
    }

    // Also create user profile in `users` table
    const userId = data?.user?.id; // ✅ now defined
    console.log("New user ID:", userId);
    console.log("New user ID:", metadata);

    try {
      await supabase.from("users").insert({
        id: userId,
        first_name: metadata.firstName,
        last_name: metadata.lastName,
        email: metadata.email,
        phone: metadata.phone,
        address: metadata.address,
        city: metadata.city,
        country: metadata.country,
        role: "customer", // or "customer"
      });
    } catch (error) {
      console.error("Error inserting into users table:", error.message);
    }

    toast.success("Account created successfully! Welcome Onboard");
    setLoading(false);
    return { success: true, user: data?.user };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (updatedData) => {
    if (!user) return { success: false, error: "Not authenticated" };

    setLoading(true);
    const { error } = await supabase
      .from("users")
      .update(updatedData)
      .eq("id", user.id);

    if (error) {
      toast.error("Profile update failed");
      setLoading(false);
      return { success: false, error };
    }

    const { data: updatedProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    setUser({ ...user, ...updatedProfile });
    toast.success("Profile updated successfully!");
    setLoading(false);
    return { success: true, user: { ...user, ...updatedProfile } };
  };

  const isAdmin = user?.role === "admin";
  const isCustomer = user?.role === "customer";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isCustomer,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
