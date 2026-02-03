import torch
import torch.nn as nn
import numpy as np

class ANFIS(nn.Module):
    def __init__(self, n_inputs, n_rules, learning_rate=0.01, seed=42):
        super(ANFIS, self).__init__()
        self.n_inputs = n_inputs
        self.n_rules = n_rules
        
        # --- LAYER 1: PREMISE (Fuzzification) ---
        # We use Gaussian Bell curves: exp(-0.5 * ((x - mu) / sigma)^2)
        
        # CRITICAL FIX: We removed "* 0.1" here. 
        # We allow parameters to start in a Standard Normal distribution (-2 to +2).
        # This prevents "Mean Collapse" where the model gets stuck guessing the average.
        self.mu = nn.Parameter(torch.randn(n_inputs, n_rules)) 
        self.sigma = nn.Parameter(torch.ones(n_inputs, n_rules))
        
        # --- LAYER 4: CONSEQUENT (Rule Output) ---
        # f = p*x + q*y + ... + r
        # We need weights for every input (n_inputs) + 1 bias term (r)
        self.consequent_weights = nn.Parameter(torch.randn(n_rules, n_inputs + 1))
        
        self.optimizer = torch.optim.Adam(self.parameters(), lr=learning_rate)
        self.criterion = nn.MSELoss() 
        
    def forward(self, x):
        # x shape: (batch_size, n_inputs)
        batch_size = x.size(0)
        
        # 1. Fuzzify Inputs (Calculate Membership)
        # Expand x to match rules: (batch, input, 1) -> (batch, input, rules)
        x_expand = x.unsqueeze(2).expand(-1, -1, self.n_rules)
        
        # Expand parameters
        mu_expand = self.mu.unsqueeze(0).expand(batch_size, -1, -1)
        sigma_expand = self.sigma.unsqueeze(0).expand(batch_size, -1, -1)
        
        # Gaussian formula
        membership = torch.exp(-0.5 * torch.pow((x_expand - mu_expand) / sigma_expand, 2))
        
        # 2. Rule Firing Strength (AND Logic)
        # Product of memberships across all inputs
        w = torch.prod(membership, dim=1) # Shape: (batch, rules)
        
        # 3. Normalize Firing Strength
        # w_norm = w / sum(w)
        w_sum = torch.sum(w, dim=1, keepdim=True)
        w_norm = w / (w_sum + 1e-8) # Avoid division by zero
        
        # 4. Consequent Calculation
        # Create augmented X with a 1 for the bias term
        x_aug = torch.cat([x, torch.ones(batch_size, 1).to(x.device)], dim=1) 
        
        # Calculate rule outputs: (batch, rules)
        rule_outputs = torch.matmul(x_aug, self.consequent_weights.t())
        
        # 5. Defuzzification (Weighted Sum)
        final_output = torch.sum(w_norm * rule_outputs, dim=1)
        
        return final_output

    def fit(self, X_train, y_train, epochs=100):
        # Convert numpy to torch tensors if needed
        if not torch.is_tensor(X_train):
            X_train = torch.tensor(X_train, dtype=torch.float32)
            y_train = torch.tensor(y_train, dtype=torch.float32)
            
        history = []
        print(f"Training ANFIS for {epochs} epochs...")
        
        for i in range(epochs):
            self.optimizer.zero_grad()
            
            y_pred = self.forward(X_train)
            loss = self.criterion(y_pred, y_train)
            
            loss.backward()
            self.optimizer.step()
            
            history.append(loss.item())
            
            if i % 10 == 0:
                print(f"Epoch {i}: Loss = {loss.item():.4f}")
                
        return history

    def predict(self, X):
        if not torch.is_tensor(X):
            X = torch.tensor(X, dtype=torch.float32)
        
        with torch.no_grad():
            output = self.forward(X)
            # Rounding to nearest integer for 3-level (0, 1, 2)
            predicted_classes = torch.round(output)
            return predicted_classes.numpy()