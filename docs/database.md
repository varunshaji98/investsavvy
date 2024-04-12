# Database Structure

### Users 
Stores all data of the users

|      Name       |     Type     |
| :-------------: | :----------: |
|       id        |     int      |
|   first_name    | varchar(255) |
|    last_name    | varchar(255) |
|      email      | varchar(255) |
|  password_hash  | varchar(512) |
| risk_profile_id |     int      |
|    user_type    | varchar(255) |

### Survey_Results
Stores the financial risk survey results of each user

|          Name         |     Type     |
|:---------------------:|:------------:|
|           id          |      int     |
|        user_id        |      int     |
|          age          |      int     |
|       occupation      | varchar(255) |
|         income        | varchar(255) |
|     risk_tolerance    | varchar(255) |
| investment_experience | varchar(255) |
|      time_horizon     | varchar(255) |
|    investment_goal    | varchar(255) |
|  investment_knowledge | varchar(255) |

### Tickers
Stores all the financial product (stock, ETF, REITs) details used for recommendations

|       Name      |     Type     |
|:---------------:|:------------:|
|        id       |      int     |
|       type      | varchar(255) |
|      symbol     | varchar(255) |
|       name      | varchar(255) |
|   description   |  text(65535) |
|     industry    | varchar(255) |
| risk_profile_id |      int     |