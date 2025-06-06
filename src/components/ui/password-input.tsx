
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { validatePassword, getPasswordStrength } from "@/utils/passwordValidation";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrength?: boolean;
  className?: string;
}

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Password", 
  showStrength = true,
  className = ""
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const validation = validatePassword(value);
  const strength = getPasswordStrength(value);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={className}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>

      {showStrength && value && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  strength.strength < 2 ? 'bg-red-500' :
                  strength.strength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(strength.strength / 5) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${strength.color}`}>
              {strength.label}
            </span>
          </div>

          {!validation.isValid && (
            <ul className="text-sm text-red-600 space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
