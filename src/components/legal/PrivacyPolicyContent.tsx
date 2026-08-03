export function PrivacyPolicyContent() {
  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="space-y-1">
        <p className="text-text-secondary">
          <strong>Effective date:</strong> [INSERT EFFECTIVE DATE]
        </p>
        <p className="text-text-secondary">
          <strong>Last updated:</strong> [INSERT LAST-UPDATED DATE]
        </p>
      </div>

      {/* Section 1 */}
      <Section number="1" title="Introduction">
        <p>
          Qaliye respects your privacy and is committed to protecting your
          personal information.
        </p>
        <p>This Privacy Policy explains how we collect, use, store, share, and protect personal information when you use:</p>
        <List
          items={[
            "the Qaliye mobile application;",
            "the Qaliye website at www.qaliye.com;",
            "our customer-support services; and",
            "any related Qaliye features, subscriptions, products, or services.",
          ]}
        />
        <p>Together, these are referred to as the &ldquo;Services.&rdquo;</p>
        <p>
          Qaliye is a dating and relationship platform designed primarily for
          Habesha communities, including Ethiopian and Eritrean people and
          members of the global diaspora.
        </p>
        <p>Qaliye is available only to people aged 18 or over.</p>
        <p>
          This Privacy Policy should be read alongside our{" "}
          <a href="/terms" className="text-primary hover:underline">Terms of Use</a>{" "}
          and{" "}
          <a href="/community-guidelines" className="text-primary hover:underline">Community Guidelines</a>,
          which are available on our website and within the application.
        </p>
      </Section>

      {/* Section 2 */}
      <Section number="2" title="Who We Are">
        <p>Qaliye is operated by:</p>
        <div className="space-y-1">
          <p><strong>[YOUR FULL LEGAL NAME]</strong>, a sole trader trading as <strong>Qaliye</strong></p>
          <p><strong>Business address:</strong> [YOUR BUSINESS ADDRESS]</p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href="http://www.qaliye.com" className="text-primary hover:underline">www.qaliye.com</a>
          </p>
        </div>
        <p>
          For the purposes of UK data-protection law, <strong>[YOUR FULL LEGAL NAME], trading as Qaliye</strong>, is the controller of the personal information described in this Privacy Policy.
        </p>
        <p>This means that we decide why and how your personal information is processed.</p>
        <p>
          We have not appointed a Data Protection Officer as we are not required
          to do so under data-protection law. Privacy queries are handled by the
          controller whose details are provided above.
        </p>
        <p>
          If you are located in the European Economic Area, this policy also
          complies with the EU General Data Protection Regulation (EU GDPR), and{" "}
          <strong>[YOUR FULL LEGAL NAME], trading as Qaliye</strong>, is the
          controller for those purposes. We have not appointed an EU
          representative under Article 27 of the EU GDPR at this time; all
          privacy queries should be directed to the contact details above.
        </p>
        <p>Questions about this Privacy Policy or our handling of personal information should be sent to:</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
        </p>
      </Section>

      {/* Section 3 */}
      <Section number="3" title="Information We Collect">
        <p>
          The personal information we collect depends on how you use Qaliye and
          which features you choose to use.
        </p>

        <Subsection number="3.1" title="Account and identity information">
          <p>When you create or manage an account, we may collect:</p>
          <List
            items={[
              "your name or profile name;",
              "email address;",
              "telephone number;",
              "date of birth and age;",
              "gender;",
              "account identifier;",
              "login and authentication information;",
              "authentication provider, such as Apple, Google, email, or telephone;",
              "account-creation date;",
              "account status;",
              "verification status;",
              "language preferences; and",
              "information used to recover or secure your account.",
            ]}
          />
          <p>
            Where you sign in using Apple or Google, we may receive information
            from that provider, such as your name, email address, provider
            identifier, and authentication confirmation.
          </p>
          <p>
            The information received depends on your settings and the
            information the provider chooses to share with us.
          </p>
        </Subsection>

        <Subsection number="3.2" title="Profile information">
          <p>You may choose or be required to provide information for your dating profile, including:</p>
          <List
            items={[
              "profile photographs;",
              "biography or profile description;",
              "age;",
              "gender;",
              "city and country;",
              "languages;",
              "ethnicity or cultural background;",
              "religion;",
              "education;",
              "occupation;",
              "height;",
              "relationship intentions;",
              "marital status;",
              "whether you have children;",
              "whether you want children;",
              "lifestyle information;",
              "interests;",
              "cultural preferences;",
              "relocation preferences; and",
              "other profile details you choose to provide.",
            ]}
          />
          <p>Some of this information may be visible to other Qaliye users.</p>
          <p>
            Your profile visibility depends on your settings, account status,
            discovery preferences, blocks, matches, and the operation of the
            Services.
          </p>
        </Subsection>

        <Subsection number="3.3" title="Special-category information">
          <p>
            Some information processed through Qaliye may be considered
            particularly sensitive under data-protection law.
          </p>
          <p>This may include information revealing or concerning:</p>
          <List
            items={[
              "racial or ethnic origin;",
              "religious or philosophical beliefs;",
              "health information;",
              "sex life; or",
              "sexual orientation.",
            ]}
          />
          <p>
            For example, your ethnicity, religion, gender, dating preferences,
            profile information, or interactions may reveal or allow inferences
            about sensitive aspects of your identity.
          </p>
          <p>
            Where we ask you to provide special-category information for
            profile, discovery, or matching purposes, we rely on your{" "}
            <strong>explicit consent</strong>.
          </p>
          <p>
            You are not required to provide optional information about religion,
            ethnicity, or similar characteristics. However, some dating or
            filtering features may not function without the information required
            for those features.
          </p>
          <p>
            You may withdraw your consent through your account settings where
            available, by removing the information, or by contacting{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>.
          </p>
          <p>
            Withdrawing consent does not make earlier processing unlawful. It
            may affect our ability to provide features that rely on that
            information.
          </p>
        </Subsection>

        <Subsection number="3.4" title="Photographs and media">
          <p>We collect content that you upload or send through Qaliye, including:</p>
          <List
            items={[
              "profile photographs;",
              "photographs sent in conversations;",
              "image metadata;",
              "upload dates and times;",
              "storage identifiers; and",
              "content-moderation results.",
            ]}
          />
          <p>
            Do not upload photographs or recordings of another person unless you
            have the right and permission to do so.
          </p>
        </Subsection>

        <Subsection number="3.5" title="Photo-moderation information">
          <p>
            We use automated content-moderation technology, including{" "}
            <strong>Amazon Rekognition</strong>, to analyse photographs for
            suspected:
          </p>
          <List
            items={[
              "nudity;",
              "sexually explicit material;",
              "sexualised content; and",
              "other content that may violate our Terms of Use or Community Guidelines.",
            ]}
          />
          <p>When a photograph is checked, we may process:</p>
          <List
            items={[
              "the photograph;",
              "moderation labels or categories;",
              "confidence scores;",
              "the date and time of the check;",
              "whether the photograph passed or failed;",
              "the reason it was flagged;",
              "review or appeal information; and",
              "any action taken.",
            ]}
          />
          <p>
            If a photograph is identified as potentially prohibited, it may be
            rejected, hidden, removed, or referred for further review. You may
            be prompted to choose a different photograph.
          </p>
          <p>
            Automated moderation may occasionally make mistakes. You may contact{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>{" "}
            to request a review of a moderation decision.
          </p>
          <p>
            We do not use Amazon Rekognition to establish your identity unless
            we clearly notify you and obtain any permission required by law.
          </p>
        </Subsection>

        <Subsection number="3.6" title="Location information">
          <p>
            Qaliye uses location information to provide discovery, distance, and
            location-based dating features.
          </p>
          <p>We may collect:</p>
          <List
            items={[
              "country;",
              "city;",
              "approximate location;",
              "latitude and longitude;",
              "location selected manually by you;",
              "location obtained from your device with permission;",
              "distance between users; and",
              "location-update dates and times.",
            ]}
          />
          <p>You can control device-location permission through your device settings.</p>
          <p>
            If you deny or disable location access, you may still be able to
            enter a location manually, but some distance-based features may not
            work correctly.
          </p>
          <p>We do not intend to display your precise coordinates to other users.</p>
          <p>
            Other users may be shown limited location information, such as your
            city, country, or approximate distance, depending on the feature and
            your settings.
          </p>
        </Subsection>

        <Subsection number="3.7" title="Dating, discovery, and interaction information">
          <p>We process information about how you interact with Qaliye and other users, including:</p>
          <List
            items={[
              "Likes;",
              "Super Likes;",
              "passes;",
              "rewinds;",
              "received Likes;",
              "sent Likes;",
              "matches;",
              "unmatches;",
              "blocks;",
              "reports;",
              "profile views, where supported;",
              "discovery filters;",
              "age and distance preferences;",
              "country preferences;",
              "verification preferences;",
              "previously displayed profiles;",
              "Boost activation;",
              "Incognito or Private Mode settings;",
              "online or activity status;",
              "read and delivery status; and",
              "the dates and times of interactions.",
            ]}
          />
          <p>
            We use this information to operate discovery and matching features,
            avoid showing inappropriate or repeated profiles, enforce limits,
            protect users, and improve recommendations.
          </p>
        </Subsection>

        <Subsection number="3.8" title="Messages and communications">
          <p>When you communicate through Qaliye, we may process:</p>
          <List
            items={[
              "text messages;",
              "image messages;",
              "sender and recipient identifiers;",
              "conversation and match identifiers;",
              "message sequence;",
              "delivery status;",
              "read status;",
              "timestamps;",
              "attachment information;",
              "reports relating to messages; and",
              "support conversations with the Qaliye team.",
            ]}
          />
          <p>We do not routinely have people read every private conversation.</p>
          <p>
            However, authorised personnel or service providers may access
            relevant messages where reasonably necessary to:
          </p>
          <List
            items={[
              "investigate a user report;",
              "respond to a support request;",
              "protect a user from harm;",
              "detect fraud or abuse;",
              "enforce our Terms and Community Guidelines;",
              "troubleshoot a technical problem; or",
              "comply with the law.",
            ]}
          />
          <p>
            A person you message may save, copy, screenshot, record, or share
            your communication outside Qaliye. We cannot fully control what
            another user does with content they receive.
          </p>
        </Subsection>

        <Subsection number="3.9" title="Reports, blocks, and safety information">
          <p>When you report or block a user, or when someone reports you, we may collect:</p>
          <List
            items={[
              "the reporting user;",
              "the reported user;",
              "report category and explanation;",
              "reported profiles, photographs, or messages;",
              "screenshots or supporting evidence;",
              "block records;",
              "safety notes;",
              "investigation records;",
              "communications with the parties involved;",
              "moderation decisions;",
              "warnings;",
              "suspensions;",
              "bans;",
              "appeal information; and",
              "information about repeated or linked accounts.",
            ]}
          />
          <p>
            We may retain limited information about banned users to prevent them
            from creating new accounts and to protect the community.
          </p>
        </Subsection>

        <Subsection number="3.10" title="Subscription and transaction information">
          <p>When you purchase a subscription, Boost, credit, or another paid feature, we may collect:</p>
          <List
            items={[
              "product or subscription purchased;",
              "payment provider;",
              "transaction or order identifier;",
              "purchase date;",
              "amount and currency;",
              "subscription status;",
              "renewal and expiry dates;",
              "entitlement status;",
              "payment-verification result;",
              "refund or cancellation status;",
              "receipt or payment reference; and",
              "limited billing information provided by the payment processor.",
            ]}
          />
          <p>
            Payments may be processed by Apple, Google, RevenueCat, a
            web-payment provider, or a supported local payment provider.
          </p>
          <p>
            We generally do not receive or store your complete debit-card or
            credit-card number when payment is handled by an external payment
            provider.
          </p>
          <p>The provider processes payment information under its own privacy policy.</p>
        </Subsection>

        <Subsection number="3.11" title="Device and technical information">
          <p>When you use Qaliye, we may automatically collect:</p>
          <List
            items={[
              "IP address;",
              "device type;",
              "operating system;",
              "app version;",
              "device language;",
              "time zone;",
              "device or installation identifier;",
              "push-notification token;",
              "network information;",
              "login dates and times;",
              "session information;",
              "API activity;",
              "security events;",
              "error logs;",
              "performance information;",
              "crash reports; and",
              "diagnostic information.",
            ]}
          />
          <p>We use this information to operate, secure, troubleshoot, and improve the Services.</p>
        </Subsection>

        <Subsection number="3.12" title="Notification information">
          <p>If you enable notifications, we may collect:</p>
          <List
            items={[
              "push-notification token;",
              "notification permission status;",
              "notification preferences;",
              "message-preview preference;",
              "notification type;",
              "delivery status;",
              "opening or interaction information; and",
              "device information required to deliver the notification.",
            ]}
          />
          <p>
            Push notifications may be delivered through services provided by
            Expo, Apple, Google, or other notification infrastructure providers.
          </p>
          <p>You can disable notifications through Qaliye&rsquo;s settings or your device settings.</p>
        </Subsection>

        <Subsection number="3.13" title="Customer support and feedback">
          <p>When you contact us, we may collect:</p>
          <List
            items={[
              "your name;",
              "email address;",
              "account identifier;",
              "support request;",
              "attachments;",
              "correspondence;",
              "complaint information;",
              "technical details; and",
              "feedback about Qaliye.",
            ]}
          />
        </Subsection>

        <Subsection number="3.14" title="Marketing information">
          <p>Where permitted, we may collect:</p>
          <List
            items={[
              "marketing preferences;",
              "email or notification engagement;",
              "campaign information;",
              "promotional eligibility; and",
              "your consent or objection to marketing.",
            ]}
          />
          <p>You can opt out of direct marketing at any time.</p>
        </Subsection>

        <Subsection number="3.15" title="Website and cookie information">
          <p>When you use www.qaliye.com, we may collect information through cookies and similar technologies, including:</p>
          <List
            items={[
              "IP address;",
              "browser type;",
              "device type;",
              "pages visited;",
              "referral source;",
              "session duration;",
              "cookie identifiers; and",
              "website interaction information.",
            ]}
          />
          <p>
            Further information will be provided in our Cookie Policy and
            cookie-consent interface.
          </p>
        </Subsection>
      </Section>

      {/* Section 4 */}
      <Section number="4" title="How We Receive Information">
        <p>We may receive personal information:</p>
        <Subsection number="4.1" title="Directly from you">
          <p>For example, when you:</p>
          <List
            items={[
              "create an account;",
              "complete your profile;",
              "upload a photograph;",
              "send a message;",
              "select discovery preferences;",
              "purchase a subscription;",
              "report or block someone;",
              "contact support; or",
              "respond to a survey.",
            ]}
          />
        </Subsection>
        <Subsection number="4.2" title="From your device">
          <p>For example:</p>
          <List
            items={[
              "location, with permission;",
              "device and operating-system information;",
              "push-notification tokens;",
              "IP address;",
              "app logs; and",
              "crash information.",
            ]}
          />
        </Subsection>
        <Subsection number="4.3" title="From other users">
          <p>Another user may provide information about you when they:</p>
          <List
            items={[
              "interact with your profile;",
              "send you a message;",
              "report your account or content;",
              "block you; or",
              "contact us about an interaction involving you.",
            ]}
          />
        </Subsection>
        <Subsection number="4.4" title="From service providers">
          <p>We may receive information from:</p>
          <List
            items={[
              "Apple or Google sign-in;",
              "app stores;",
              "payment processors;",
              "RevenueCat;",
              "authentication providers;",
              "moderation providers;",
              "hosting and database providers;",
              "analytics providers;",
              "notification providers; and",
              "fraud- or security-service providers.",
            ]}
          />
        </Subsection>
        <Subsection number="4.5" title="From authorities or public sources">
          <p>Where permitted by law, we may receive information from:</p>
          <List
            items={[
              "courts;",
              "regulators;",
              "law-enforcement agencies;",
              "safeguarding organisations;",
              "legal advisers; or",
              "publicly available sources.",
            ]}
          />
        </Subsection>
      </Section>

      {/* Section 5 */}
      <Section number="5" title="Why We Use Personal Information">
        <p>We use personal information for the purposes described below.</p>
        <p>
          We have conducted legitimate-interests assessments for the purposes
          where we rely on legitimate interests, and we have balanced our
          interests against your rights and freedoms. You have the right to
          object to processing based on legitimate interests (see Section 15).
        </p>

        <Subsection number="5.1" title="To create and manage your account">
          <p>We use account and authentication information to:</p>
          <List
            items={[
              "register you;",
              "sign you in;",
              "verify account access;",
              "maintain your profile;",
              "secure your account;",
              "recover your account; and",
              "communicate important service information.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Performance of our contract with you
            and our legitimate interests in account security.
          </p>
        </Subsection>

        <Subsection number="5.2" title="To provide dating, discovery, and matching services">
          <p>We use profile information, preferences, location, and interactions to:</p>
          <List
            items={[
              "display profiles;",
              "identify potentially relevant profiles;",
              "apply discovery filters;",
              "calculate approximate distance;",
              "process Likes, passes, and matches;",
              "provide messaging;",
              "manage subscriptions and benefits; and",
              "personalise your experience.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Performance of our contract with you
            and, for location-derived features such as distance calculation, our
            legitimate interests in providing location-based matching
            functionality.
          </p>
          <p>
            Where this involves special-category information, we also rely on
            your <strong>explicit consent</strong>.
          </p>
        </Subsection>

        <Subsection number="5.3" title="To display your profile to other users">
          <p>
            We use the information you choose to publish to make your profile
            available to eligible users according to your settings and
            Qaliye&rsquo;s discovery rules.
          </p>
          <p><strong>Lawful basis:</strong> Performance of our contract with you.</p>
          <p>
            Where the profile contains special-category information, we also
            rely on your <strong>explicit consent</strong>.
          </p>
        </Subsection>

        <Subsection number="5.4" title="To moderate photographs and content">
          <p>We process photographs and other relevant content to:</p>
          <List
            items={[
              "detect nudity or sexual content;",
              "prevent prohibited content from being published;",
              "enforce our Community Guidelines;",
              "protect users; and",
              "respond to reports.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Performance of our contract,
            compliance with legal obligations where applicable, and our
            legitimate interests in operating a safe dating platform.
          </p>
          <p>
            Where moderation necessarily involves special-category information,
            we rely on an appropriate condition permitted by data-protection
            law, depending on the circumstances.
          </p>
        </Subsection>

        <Subsection number="5.5" title="To investigate reports and protect users">
          <p>We process reports, messages, profiles, device information, and safety records to:</p>
          <List
            items={[
              "investigate alleged misconduct;",
              "detect fake or underage accounts;",
              "prevent harassment, scams, and abuse;",
              "enforce blocks;",
              "suspend or ban accounts;",
              "prevent ban evasion;",
              "respond to emergencies; and",
              "cooperate with authorities where legally required.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Our legitimate interests in keeping
            Qaliye safe, performance of our contract, compliance with legal
            obligations, protection of vital interests in emergencies, and
            establishment, exercise, or defence of legal claims where
            applicable.
          </p>
        </Subsection>

        <Subsection number="5.6" title="To process payments and subscriptions">
          <p>We process purchase and entitlement information to:</p>
          <List
            items={[
              "complete purchases;",
              "activate paid benefits;",
              "verify payments;",
              "manage renewals;",
              "prevent payment fraud;",
              "respond to refund requests; and",
              "maintain financial and tax records.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Performance of our contract,
            compliance with legal obligations, and our legitimate interests in
            preventing fraud and maintaining accurate financial records.
          </p>
        </Subsection>

        <Subsection number="5.7" title="To send notifications and service communications">
          <p>We may send:</p>
          <List
            items={[
              "message notifications;",
              "match notifications;",
              "Like notifications;",
              "security alerts;",
              "payment confirmations;",
              "moderation notices;",
              "legal notices;",
              "support responses; and",
              "important service updates.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Performance of our contract and our
            legitimate interests in operating and securing the Services.
          </p>
          <p>
            Where consent is legally required for a particular notification or
            marketing communication, we rely on consent.
          </p>
        </Subsection>

        <Subsection number="5.8" title="To improve and troubleshoot Qaliye">
          <p>We use technical, usage, crash, and interaction information to:</p>
          <List
            items={[
              "diagnose errors;",
              "improve performance;",
              "test features;",
              "understand how features are used;",
              "prevent outages;",
              "develop new features; and",
              "improve usability.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Our legitimate interests in
            maintaining and improving Qaliye.
          </p>
          <p>
            Where cookies or similar technologies require consent, we rely on
            consent.
          </p>
        </Subsection>

        <Subsection number="5.9" title="To prevent fraud and secure the Services">
          <p>We process account, device, transaction, location, and activity information to:</p>
          <List
            items={[
              "identify suspicious activity;",
              "prevent unauthorised access;",
              "detect automated or fake accounts;",
              "prevent payment abuse;",
              "investigate security incidents; and",
              "protect our infrastructure.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Our legitimate interests in
            protecting users, Qaliye, and our service providers, and compliance
            with legal obligations where applicable.
          </p>
        </Subsection>

        <Subsection number="5.10" title="To comply with legal obligations">
          <p>We may process information to:</p>
          <List
            items={[
              "respond to lawful requests;",
              "maintain tax and transaction records;",
              "protect legal rights;",
              "respond to regulators;",
              "investigate criminal or harmful behaviour; and",
              "establish, exercise, or defend legal claims.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Compliance with legal obligations,
            legitimate interests, vital interests, or legal claims, depending on
            the circumstances.
          </p>
        </Subsection>

        <Subsection number="5.11" title="To comply with online safety obligations">
          <p>
            We use account, content, moderation, and reporting information to
            comply with our obligations under the UK Online Safety Act 2023 and
            other applicable online-safety laws, including:
          </p>
          <List
            items={[
              "detecting and removing illegal content;",
              "protecting children from harmful content;",
              "maintaining reporting and complaints mechanisms;",
              "conducting risk assessments; and",
              "cooperating with regulators.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Compliance with legal obligations and
            our legitimate interests in operating a safe and lawful platform.
          </p>
        </Subsection>

        <Subsection number="5.12" title="To send marketing">
          <p>With any consent required by law, we may send information about:</p>
          <List
            items={[
              "new Qaliye features;",
              "subscriptions;",
              "promotions;",
              "events;",
              "offers; and",
              "community updates.",
            ]}
          />
          <p>
            <strong>Lawful basis:</strong> Consent or legitimate interests where
            legally permitted.
          </p>
          <p>You have an absolute right to object to direct marketing.</p>
        </Subsection>
      </Section>

      {/* Section 6 */}
      <Section number="6" title="Required and Optional Information">
        <p>Certain information is required to create and operate a Qaliye account, such as:</p>
        <List
          items={[
            "date of birth;",
            "confirmation that you are at least 18;",
            "gender;",
            "authentication information;",
            "core profile information;",
            "location or selected discovery location; and",
            "at least one profile photograph where required by the application.",
          ]}
        />
        <p>
          If you do not provide required information, we may be unable to create
          your account or provide the relevant feature.
        </p>
        <p>
          Other information, such as religion, ethnicity, interests, occupation,
          or additional photographs, may be optional.
        </p>
      </Section>

      {/* Section 7 */}
      <Section number="7" title="Matching, Recommendations, and Profiling">
        <p>Qaliye uses automated systems to organise and recommend profiles.</p>
        <p>These systems may consider:</p>
        <List
          items={[
            "age and age preferences;",
            "gender and dating preferences;",
            "location and maximum distance;",
            "selected countries;",
            "languages;",
            "religion;",
            "ethnicity;",
            "children and family preferences;",
            "verification status;",
            "previous Likes, passes, and matches;",
            "blocks and reports;",
            "profile availability; and",
            "subscription or visibility features.",
          ]}
        />
        <p>
          The purpose of this processing is to show profiles that satisfy
          user-selected preferences, maintain safety, and improve discovery.
        </p>
        <p>
          Profile recommendations do not guarantee compatibility or
          relationship success.
        </p>
        <p>
          We do not currently use automated systems to make decisions that
          produce legal effects or similarly significant effects on you without
          appropriate safeguards. Where automated systems make decisions that
          could affect your use of the Services (such as photo-moderation
          decisions under Section 8), those decisions are subject to human
          review on request and do not solely produce legal or similarly
          significant effects.
        </p>
      </Section>

      {/* Section 8 */}
      <Section number="8" title="Automated Photo-Moderation Decisions">
        <p>
          Amazon Rekognition may automatically analyse an uploaded photograph
          and provide moderation categories and confidence scores.
        </p>
        <p>Our systems may use those results to:</p>
        <List
          items={[
            "approve the photograph;",
            "reject the photograph;",
            "prevent it from becoming visible;",
            "request a different photograph; or",
            "refer it for review.",
          ]}
        />
        <p>A rejected photograph does not automatically terminate your account.</p>
        <p>
          These automated decisions do not solely produce legal or similarly
          significant effects on you because you have the right to request human
          review of any moderation decision by contacting{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>.
          A human reviewer will assess the photograph and the moderation result
          and may overturn the automated decision.
        </p>
        <p>
          We may take separate account action where there are repeated, serious,
          or deliberate attempts to upload prohibited content.
        </p>
      </Section>

      {/* Section 9 */}
      <Section number="9" title="Who Can See Your Information">
        <Subsection number="9.1" title="Other Qaliye users">
          <p>Other users may see information made available through your profile, such as:</p>
          <List
            items={[
              "photographs;",
              "profile name;",
              "age;",
              "city or country;",
              "biography;",
              "interests;",
              "ethnicity;",
              "religion;",
              "languages;",
              "relationship intentions;",
              "lifestyle information;",
              "family preferences;",
              "verification status; and",
              "approximate distance or activity information.",
            ]}
          />
          <p>The information shown may depend on:</p>
          <List
            items={[
              "your privacy settings;",
              "Incognito or Private Mode;",
              "blocks;",
              "discovery preferences;",
              "matching status;",
              "subscription features; and",
              "Qaliye&rsquo;s safety systems.",
            ]}
          />
        </Subsection>
        <Subsection number="9.2" title="Matched users">
          <p>Users you match with may see additional information required for communication, such as:</p>
          <List
            items={[
              "messages;",
              "message attachments;",
              "read status;",
              "delivery status; and",
              "activity status where enabled.",
            ]}
          />
        </Subsection>
        <Subsection number="9.3" title="People outside Qaliye">
          <p>
            Other users may copy, record, or share information outside Qaliye.
            Although this may violate our rules, we cannot guarantee that
            content visible to another person will remain within the
            application.
          </p>
        </Subsection>
      </Section>

      {/* Section 10 */}
      <Section number="10" title="How We Share Personal Information">
        <p>We do not sell your personal information.</p>
        <p>We may share information as described below.</p>

        <Subsection number="10.1" title="Service providers">
          <p>We use providers that help us operate Qaliye, including providers of:</p>
          <List
            items={[
              "cloud infrastructure;",
              "database and storage services;",
              "authentication;",
              "content moderation;",
              "push notifications;",
              "analytics;",
              "crash reporting;",
              "customer support;",
              "email delivery;",
              "payment processing;",
              "subscriptions;",
              "fraud prevention; and",
              "security.",
            ]}
          />
          <p>These may include, depending on the feature and platform:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-text-secondary border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-semibold">Provider</th>
                  <th className="text-left py-2 pr-4 font-semibold">Service</th>
                  <th className="text-left py-2 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">Amazon Web Services (including Amazon Rekognition)</td>
                  <td className="py-2 pr-4">Cloud infrastructure, content moderation, storage</td>
                  <td className="py-2">Processor</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">Supabase</td>
                  <td className="py-2 pr-4">Database, authentication, storage</td>
                  <td className="py-2">Processor</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">Apple</td>
                  <td className="py-2 pr-4">App store, sign-in, push notifications, payment processing</td>
                  <td className="py-2">Controller for its own services</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">Google</td>
                  <td className="py-2 pr-4">App store, sign-in, push notifications, payment processing</td>
                  <td className="py-2">Controller for its own services</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">Expo</td>
                  <td className="py-2 pr-4">Push notification delivery, app infrastructure</td>
                  <td className="py-2">Processor</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">RevenueCat</td>
                  <td className="py-2 pr-4">Subscription management and analytics</td>
                  <td className="py-2">Processor</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-2 pr-4">[ANALYTICS PROVIDER, e.g. PostHog / Sentry]</td>
                  <td className="py-2 pr-4">Analytics and crash reporting</td>
                  <td className="py-2">Processor</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Supported web or local payment providers</td>
                  <td className="py-2 pr-4">Payment processing</td>
                  <td className="py-2">Controller for its own payment services</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            These organisations may process information on our behalf as
            processors, or they may act as separate controllers for parts of
            their services (such as Apple and Google for their own account
            information). Where they act as controllers, they process
            information under their own privacy policies.
          </p>
        </Subsection>

        <Subsection number="10.2" title="Other users">
          <p>
            We share profile and interaction information with other users as
            necessary to provide discovery, matching, and communication
            features.
          </p>
        </Subsection>

        <Subsection number="10.3" title="Authorities and legal recipients">
          <p>We may share information with:</p>
          <List
            items={[
              "law-enforcement agencies;",
              "courts;",
              "regulators;",
              "tax authorities;",
              "safeguarding organisations;",
              "emergency services; or",
              "legal advisers",
            ]}
          />
          <p>
            where required by law or where reasonably necessary to prevent
            serious harm, investigate unlawful conduct, protect legal rights, or
            respond to a valid legal request.
          </p>
        </Subsection>

        <Subsection number="10.4" title="Business transfers">
          <p>
            If Qaliye is sold, reorganised, transferred, merged, or converted
            into another legal structure, personal information may be disclosed
            to professional advisers and a prospective or actual successor.
          </p>
          <p>
            Any recipient must use the information consistently with applicable
            data-protection law.
          </p>
        </Subsection>

        <Subsection number="10.5" title="With your direction or consent">
          <p>We may share information where you ask us to do so or provide valid consent.</p>
        </Subsection>
      </Section>

      {/* Section 11 */}
      <Section number="11" title="International Transfers">
        <p>
          Qaliye is operated from the United Kingdom, but some users and service
          providers may be located in other countries.
        </p>
        <p>
          Your information may therefore be processed or accessed outside the
          United Kingdom, including in countries whose data-protection laws
          differ from UK law.
        </p>
        <p>Where UK data-protection rules governing international transfers apply, we use an appropriate transfer mechanism, such as:</p>
        <List
          items={[
            "UK adequacy regulations;",
            "the UK International Data Transfer Agreement;",
            "the UK Addendum to approved standard contractual clauses;",
            "another legally recognised safeguard; or",
            "a permitted legal exception where appropriate.",
          ]}
        />
        <p>
          We also consider supplementary technical and organisational protections
          where required.
        </p>
        <p>
          For transfers of personal information of users in the European
          Economic Area, we rely on the EU Standard Contractual Clauses or other
          appropriate transfer mechanisms recognised under the EU GDPR.
        </p>
        <p>
          You may contact{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>{" "}
          for further information about the safeguards used for a particular
          transfer.
        </p>
      </Section>

      {/* Section 12 */}
      <Section number="12" title="How Long We Keep Information">
        <p>
          We keep personal information only for as long as reasonably necessary
          for the purposes described in this Privacy Policy, including providing
          the Services, protecting users, resolving disputes, enforcing
          agreements, and meeting legal obligations.
        </p>
        <p>Our intended retention periods are as follows:</p>

        <Subsection number="12.1" title="Active account information">
          <p>
            We generally retain account, profile, preference, interaction, and
            communication information while your account remains active.
          </p>
        </Subsection>
        <Subsection number="12.2" title="Deleted accounts">
          <p>When you request account deletion:</p>
          <List
            items={[
              "your profile should stop being available to other users;",
              "we aim to remove account and profile information from active systems within 30 days;",
              "some information may remain in encrypted backups for up to 90 days; and",
              "certain records may be retained for longer for safety, fraud prevention, financial, legal, or regulatory reasons.",
            ]}
          />
          <p>
            Data retained in backups is not restored for ordinary business use
            and is deleted or overwritten according to the backup schedule.
          </p>
        </Subsection>
        <Subsection number="12.3" title="Photographs">
          <p>Active profile photographs are retained while used on your account.</p>
          <p>Deleted or replaced photographs are removed from active use and are normally deleted within 30 days, unless they are connected with:</p>
          <List
            items={[
              "a report;",
              "an appeal;",
              "a safety investigation;",
              "legal proceedings; or",
              "a legal preservation obligation.",
            ]}
          />
          <p>
            Photographs rejected by automated moderation are normally deleted
            within 30 days unless retained temporarily for review, security, or
            appeal purposes.
          </p>
        </Subsection>
        <Subsection number="12.4" title="Messages">
          <p>
            Messages may be retained while an account or relevant conversation
            remains active.
          </p>
          <p>When an account or conversation is deleted, messages may be removed from active access but retained temporarily in backups or where required for:</p>
          <List
            items={[
              "user safety;",
              "reports;",
              "dispute resolution;",
              "fraud prevention;",
              "legal claims; or",
              "compliance with law.",
            ]}
          />
          <p>Copies saved by another user are outside our control.</p>
        </Subsection>
        <Subsection number="12.5" title="Reports and safety records">
          <p>
            Reports, moderation decisions, blocks, investigations, and
            enforcement records may generally be retained for up to three years
            after the case is closed.
          </p>
          <p>
            We may retain limited records for longer — up to six years where
            connected to legal proceedings — where reasonably necessary to:
          </p>
          <List
            items={[
              "enforce a permanent ban;",
              "prevent ban evasion;",
              "protect users from a documented risk;",
              "establish or defend legal claims; or",
              "comply with legal requirements.",
            ]}
          />
        </Subsection>
        <Subsection number="12.6" title="Support records">
          <p>
            Support communications may generally be retained for up to three
            years after the request is closed, unless a longer period is needed
            for a complaint, legal claim, or safety matter.
          </p>
        </Subsection>
        <Subsection number="12.7" title="Technical and security logs">
          <p>
            Routine technical, security, and access logs may generally be
            retained for up to 12 months.
          </p>
          <p>
            Logs connected with fraud, abuse, a security incident, or a legal
            claim may be retained for longer.
          </p>
        </Subsection>
        <Subsection number="12.8" title="Push-notification tokens">
          <p>
            Push tokens are retained while associated with an active account and
            device. They may be removed when:
          </p>
          <List
            items={[
              "you log out;",
              "the token becomes invalid;",
              "you remove the device;",
              "you delete your account; or",
              "the token is no longer needed.",
            ]}
          />
          <p>
            Notification delivery status and interaction information (such as
            whether a notification was opened) may be retained for up to 12
            months for troubleshooting and improvement purposes.
          </p>
        </Subsection>
        <Subsection number="12.9" title="Transaction and tax information">
          <p>
            Transaction, payment, refund, and accounting records are retained
            for the period required by applicable tax, accounting,
            fraud-prevention, and legal obligations.
          </p>
          <p>
            For UK sole-trader records, this may be at least five years after
            the relevant Self Assessment filing deadline.
          </p>
        </Subsection>
        <Subsection number="12.10" title="Marketing preferences">
          <p>
            We may retain a minimal record of an unsubscribe or marketing
            objection for as long as necessary to ensure that we continue to
            respect it.
          </p>
        </Subsection>
        <Subsection number="12.11" title="Legal preservation">
          <p>We may suspend ordinary deletion where information is reasonably required for:</p>
          <List
            items={[
              "litigation;",
              "an active complaint;",
              "a regulatory investigation;",
              "a law-enforcement request;",
              "protection from serious harm; or",
              "another legal obligation.",
            ]}
          />
          <p>When information is no longer required, it will be deleted or anonymised.</p>
        </Subsection>
      </Section>

      {/* Section 13 */}
      <Section number="13" title="Account Deletion">
        <p>
          You may request deletion through the account settings where available
          or by emailing{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>.
        </p>
        <p>Deleting the application from your device does not delete your account.</p>
        <p>Cancelling a subscription does not automatically delete your account.</p>
        <p>
          Deleting your account does not necessarily cancel a subscription
          purchased through Apple, Google, or another payment provider. You must
          manage the subscription through the provider that processed it.
        </p>
        <p>
          We may ask you to verify your identity before completing a deletion
          request.
        </p>
        <p>
          Some information may be retained where permitted or required by law,
          including financial, security, fraud-prevention, reporting, and
          enforcement records.
        </p>
      </Section>

      {/* Section 14 */}
      <Section number="14" title="Your Data-Protection Rights">
        <p>Depending on your location and the circumstances, you may have the right to:</p>
        <Subsection number="14.1" title="Be informed">
          <p>
            You have the right to receive clear information about how we process
            your personal information.
          </p>
        </Subsection>
        <Subsection number="14.2" title="Access your information">
          <p>
            You may request confirmation that we process your personal
            information and receive a copy of information to which you are
            legally entitled.
          </p>
          <p>
            Where available, you may also access certain account information
            directly through your in-app profile and settings. If you would like
            a comprehensive export of your data, contact us using the details in
            Section 16.
          </p>
        </Subsection>
        <Subsection number="14.3" title="Correct information">
          <p>
            You may request correction of inaccurate information and completion
            of incomplete information.
          </p>
          <p>Many profile details can be updated directly through your account.</p>
        </Subsection>
        <Subsection number="14.4" title="Request deletion">
          <p>
            You may request deletion of your personal information where the
            applicable legal conditions are satisfied.
          </p>
          <p>
            The right to deletion is not absolute. We may retain information
            where we have a legal reason to do so.
          </p>
        </Subsection>
        <Subsection number="14.5" title="Restrict processing">
          <p>
            You may request that we temporarily or permanently restrict
            particular processing in certain circumstances.
          </p>
        </Subsection>
        <Subsection number="14.6" title="Data portability">
          <p>
            Where processing is based on consent or contract and carried out by
            automated means, you may have the right to receive certain
            information in a structured, commonly used, and machine-readable
            format.
          </p>
        </Subsection>
        <Subsection number="14.7" title="Object to processing">
          <p>You may object to processing based on legitimate interests.</p>
          <p>
            We will stop the relevant processing unless we have compelling
            legitimate grounds to continue or the processing is needed for legal
            claims.
          </p>
        </Subsection>
        <Subsection number="14.8" title="Withdraw consent">
          <p>
            Where we rely on consent, including explicit consent for
            special-category information, you may withdraw it at any time.
          </p>
          <p>
            Withdrawal does not affect the lawfulness of processing completed
            before withdrawal.
          </p>
        </Subsection>
        <Subsection number="14.9" title="Rights concerning automated decisions">
          <p>
            You may request information about certain solely automated decisions
            and ask for human involvement, express your point of view, or
            challenge the decision.
          </p>
          <p>
            In particular, if an automated photo-moderation decision adversely
            affects you, you may request human review by contacting{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>.
          </p>
        </Subsection>
        <Subsection number="14.10" title="Complain to a regulator">
          <p>
            You may complain to the UK Information Commissioner&rsquo;s Office or
            another competent data-protection authority.
          </p>
          <p>
            We encourage you to contact us first so that we have an opportunity
            to address your concern.
          </p>
        </Subsection>
      </Section>

      {/* Section 15 */}
      <Section number="15" title="Your Right to Object">
        <p>
          <strong>You have the right to object at any time to our use of your personal information for direct marketing.</strong>
        </p>
        <p>
          Where you object to direct marketing, we will stop using your
          information for that purpose.
        </p>
        <p>
          You may also object to processing based on our legitimate interests.
          Contact{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>{" "}
          and explain the processing to which you object.
        </p>
      </Section>

      {/* Section 16 */}
      <Section number="16" title="Exercising Your Rights">
        <p>To exercise a privacy right, contact:</p>
        <div className="space-y-1">
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
          </p>
          <p><strong>Subject:</strong> Privacy request</p>
        </div>
        <p>Please provide enough information for us to:</p>
        <List
          items={[
            "identify your account;",
            "understand your request; and",
            "verify that you are the account holder or authorised representative.",
          ]}
        />
        <p>
          We may ask for additional verification to protect your information from
          unauthorised disclosure or deletion.
        </p>
        <p>
          We normally respond without undue delay and within the time required
          by applicable law (generally one month, which may be extended by two
          further months for complex requests).
        </p>
        <p>
          There is normally no charge. However, the law may allow us to charge a
          reasonable fee or refuse a request that is manifestly unfounded or
          excessive.
        </p>
        <p>
          If we refuse all or part of a request, we will explain our reason
          where legally permitted.
        </p>
      </Section>

      {/* Section 17 */}
      <Section number="17" title="Complaints">
        <p>Questions or complaints about this Privacy Policy or our handling of your information should first be sent to:</p>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
        </p>
        <p>
          You also have the right to complain to the UK Information
          Commissioner&rsquo;s Office.
        </p>
        <p>
          Information about making a complaint is available through the
          Information Commissioner&rsquo;s Office website at{" "}
          <a href="https://ico.org.uk" className="text-primary hover:underline">ico.org.uk</a>.
        </p>
        <p>
          If you live outside the United Kingdom, you may also have the right to
          complain to the data-protection authority in the country where you
          live or work.
        </p>
      </Section>

      {/* Section 18 */}
      <Section number="18" title="Security">
        <p>
          We use appropriate technical and organisational measures designed to
          protect personal information.
        </p>
        <p>These measures may include:</p>
        <List
          items={[
            "encryption in transit;",
            "encryption at rest where supported;",
            "restricted administrative access;",
            "authentication and authorisation controls;",
            "signed or time-limited media links;",
            "secure cloud storage;",
            "password and token protection;",
            "monitoring and logging;",
            "backups;",
            "vulnerability and dependency management;",
            "staff or contractor confidentiality obligations; and",
            "incident-response procedures.",
          ]}
        />
        <p>No online service can guarantee absolute security.</p>
        <p>You are responsible for:</p>
        <List
          items={[
            "protecting your login credentials;",
            "securing your device;",
            "keeping your app updated;",
            "avoiding suspicious links; and",
            "notifying us promptly if you believe your account has been compromised.",
          ]}
        />
      </Section>

      {/* Section 19 */}
      <Section number="19" title="Personal-Data Breaches">
        <p>
          If we become aware of a personal-data breach, we will investigate it
          and take reasonable steps to contain and address it.
        </p>
        <p>Where required by law, we will notify:</p>
        <List
          items={[
            "the Information Commissioner&rsquo;s Office or another competent regulator; and",
            "affected users where the breach is likely to create a high risk to their rights and freedoms.",
          ]}
        />
      </Section>

      {/* Section 20 */}
      <Section number="20" title="Children">
        <p>Qaliye is strictly for people aged 18 and over.</p>
        <p>
          We do not knowingly permit children to create accounts or use the
          dating Services.
        </p>
        <p>
          We collect date of birth information to apply our age requirement.
          Where permitted and where we reasonably suspect that a user may be
          under 18, we may use additional age-estimation or age-verification
          measures, including automated photo-based age estimation or requests
          for identification documents. We will notify you if we use such
          measures.
        </p>
        <p>If we reasonably believe that an account belongs to someone under 18, we may:</p>
        <List
          items={[
            "suspend the account;",
            "request age-verification information;",
            "remove the profile;",
            "preserve evidence where necessary for safeguarding; and",
            "delete the account and associated information.",
          ]}
        />
        <p>
          If you believe that a person under 18 is using Qaliye, report the
          account through the application or contact{" "}
          <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>{" "}
          immediately.
        </p>
      </Section>

      {/* Section 21 */}
      <Section number="21" title="Third-Party Links and Services">
        <p>
          Qaliye may contain links to third-party websites, services, or
          applications.
        </p>
        <p>
          We are not responsible for the privacy practices of third parties that
          operate independently from Qaliye.
        </p>
        <p>
          Review their privacy policies before providing them with personal
          information.
        </p>
      </Section>

      {/* Section 22 */}
      <Section number="22" title="Marketing">
        <p>We may send marketing communications where permitted by law.</p>
        <p>You can stop marketing emails by:</p>
        <List
          items={[
            "using the unsubscribe option in the email;",
            "changing your account preferences; or",
            "contacting support@qaliye.com.",
          ]}
        />
        <p>
          You can control promotional push notifications through your Qaliye or
          device settings.
        </p>
        <p>Even if you opt out of marketing, we may continue sending necessary service messages, including:</p>
        <List
          items={[
            "security alerts;",
            "payment notices;",
            "support responses;",
            "moderation decisions;",
            "changes to legal documents; and",
            "important account information.",
          ]}
        />
      </Section>

      {/* Section 23 */}
      <Section number="23" title="Cookies">
        <p>Our website may use essential cookies required for:</p>
        <List
          items={[
            "security;",
            "authentication;",
            "session management;",
            "user preferences; and",
            "core website functionality.",
          ]}
        />
        <p>With consent where required, we may also use analytics or performance cookies.</p>
        <p>
          Further details, including the specific cookies used, their purposes,
          and how to change your choices, are provided in the{" "}
          <strong>Qaliye Cookie Policy</strong>, available at{" "}
          <a href="http://www.qaliye.com/cookie-policy" className="text-primary hover:underline">www.qaliye.com/cookie-policy</a>.
        </p>
      </Section>

      {/* Section 24 */}
      <Section number="24" title="Changes to This Privacy Policy">
        <p>We may update this Privacy Policy to reflect:</p>
        <List
          items={[
            "changes to Qaliye;",
            "new features;",
            "changes to service providers;",
            "legal or regulatory requirements;",
            "security developments; or",
            "improvements in how we explain our practices.",
          ]}
        />
        <p>
          The updated policy will show a revised &ldquo;Last updated&rdquo;
          date.
        </p>
        <p>Where changes are material, we will provide reasonable notice through:</p>
        <List
          items={[
            "the application;",
            "the website;",
            "email;",
            "push notification; or",
            "another appropriate method.",
          ]}
        />
        <p>
          Where required, we will ask for consent again before using
          information for a materially different purpose.
        </p>
      </Section>

      {/* Section 25 */}
      <Section number="25" title="Languages">
        <p>
          We may provide translations of this Privacy Policy for convenience.
        </p>
        <p>
          If a translated version conflicts with the English version, the
          English version will apply unless applicable law requires otherwise.
        </p>
      </Section>

      {/* Section 26 */}
      <Section number="26" title="Contact Us">
        <p>For questions, requests, or complaints about privacy, contact:</p>
        <div className="space-y-1">
          <p><strong>Qaliye</strong></p>
          <p>Operated by <strong>[YOUR FULL LEGAL NAME], trading as Qaliye</strong></p>
          <p><strong>Business address:</strong> [YOUR BUSINESS ADDRESS]</p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@qaliye.com" className="text-primary hover:underline">support@qaliye.com</a>
          </p>
          <p>
            <strong>Website:</strong>{" "}
            <a href="http://www.qaliye.com" className="text-primary hover:underline">www.qaliye.com</a>
          </p>
        </div>
      </Section>

      <p className="text-text-secondary italic text-sm pt-4 border-t border-border">
        This Privacy Policy is provided for informational purposes and does not
        constitute legal advice. You should have a qualified data-protection
        solicitor review this document before publication.
      </p>
    </div>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 mb-8">
      <h2 className="text-xl font-bold text-text-primary">
        {number}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Subsection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 ml-4">
      <h3 className="text-lg font-semibold text-text-primary">
        {number} {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside text-text-secondary leading-relaxed space-y-1">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
