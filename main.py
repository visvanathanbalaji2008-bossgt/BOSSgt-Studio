-- Define a function that greets a user
local function greet(name)
    return "Hello, " .. name .. "!"
end

-- Create a table (list) of names
local players = {"Alice", "Bob", "Charlie"}

-- Loop through the table and print a greeting for each person
for index, name in ipairs(players) do
    local message = greet(name)
    print(message)
end
