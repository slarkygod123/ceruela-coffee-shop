
interface PasswordRequirementsProps {
    password: string;
  }
  
  export function PasswordRequirements({ password }: PasswordRequirementsProps) {
    const requirements = [
      { text: "At least 8 characters", met: password.length >= 8 },
      { text: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
      { text: "One lowercase letter (a-z)", met: /[a-z]/.test(password) },
      { text: "One number (0-9)", met: /[0-9]/.test(password) },
      { text: "One special character", met: /[^A-Za-z0-9]/.test(password) },
      { text: "No spaces", met: !password.includes(" ") },
    ];
  
    return (
      <div className="text-sm space-y-1 mt-4">
        <p className="font-medium text-gray-700 mb-2">Password Requirements:</p>
        <ul className="space-y-1">
          {requirements.map((req, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 ${
                req.met ? "text-green-600" : "text-gray-600"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${
                  req.met ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span>{req.text}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }