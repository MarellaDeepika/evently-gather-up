
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'organizer' | 'attendee';
  createdAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'organizer' | 'attendee';
}

class AuthService {
  private userKey = 'evently_current_user';
  private usersKey = 'evently_users';

  // Get current user
  getCurrentUser(): User | null {
    const stored = localStorage.getItem(this.userKey);
    return stored ? JSON.parse(stored) : null;
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Check if current user is organizer
  isOrganizer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'organizer';
  }

  // Check if current user is attendee
  isAttendee(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'attendee';
  }

  // Login
  login(loginData: LoginData): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const user = users.find(u => u.email === loginData.email);
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In real app, you'd verify password hash
    localStorage.setItem(this.userKey, JSON.stringify(user));
    return { success: true, user };
  }

  // Signup/Register
  signup(signupData: SignupData): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    
    if (users.find(u => u.email === signupData.email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      id: Date.now(),
      email: signupData.email,
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      role: signupData.role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(this.userKey, JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  }

  // Register method (alias for signup for compatibility)
  register(signupData: SignupData): { success: boolean; user?: User; error?: string } {
    return this.signup(signupData);
  }

  // Switch user role (for demo purposes)
  switchRole(newRole: 'organizer' | 'attendee'): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const updatedUser = { ...user, role: newRole };
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    
    // Update in users array
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      this.saveUsers(users);
    }

    return true;
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.userKey);
  }

  private getUsers(): User[] {
    const stored = localStorage.getItem(this.usersKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }
}

export const authService = new AuthService();
