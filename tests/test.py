"""
Selenium Test to login to Qxf2 Tutorial Page and assert the title
"""

import os
from selenium import webdriver

# Create an instance of Firefox WebDriver
driver = webdriver.Firefox()
# The driver.get method will navigate to a page given by the URL
# NOTE 1: This URL should reference localhost because it will run within a CircleCI container
# But to keep this example simple but informative, we are using an already deployed URL
# Check future posts for a complete code sample
driver.get("http://127.0.0.1:4444/wd/hub")

# Create a screenshots directory if not present
# NOTE 2: We are taking screenshots to show CircleCI artifacts
if not (os.path.exists('./tests/screenshots')):
    os.makedirs('./tests/screenshots')
# Save screenshot in the created directory
driver.save_screenshot('./tests/screenshots/test.png')

# Assert the Page Title
assert "Qxf2 Services: Selenium training main" in driver.title

# Close the browser window
driver.close()